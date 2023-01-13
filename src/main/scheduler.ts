import schedule from "node-schedule";
import mysqldump from "mysqldump";
import fs from "fs";
import zlib from "zlib";
import rimraf from 'rimraf'
import path from 'path'

process.on("SIGINT", function () {
  schedule.gracefulShutdown().then(() => process.exit(0));
});

class Sceduler {
  store: any;
  schedulejobs: any;
  constructor(opts: { store: any }) {
    this.store = opts.store;
    this.schedulejobs = [];
  }

  start() {
    let jobs = this.store.get("jobs");
    if (!jobs) jobs = `[]`;

    jobs = JSON.parse(jobs);

    let length = jobs.length;
    for (let index = 0; index < length; index++) {
      const job = jobs[index];
      this.addScheduleJob(job);
    }
  }

  stop() {
    schedule.gracefulShutdown();
  }

  deleteScheduleJob(id) {
    let index = this.schedulejobs.findIndex((e) => {
      return e.id === id;
    });

    let job = this.schedulejobs[index];

    if (job) {
      clearInterval(job.garbage)
      job.scheduled.cancel();
      this.schedulejobs.splice(index, 1);
    }
  }

  async backupSQL(job, ts) {
    try {
      let name = job.name.replaceAll(" ", "-");

      var dd = String(ts.getDate()).padStart(2, "0");
      var mm = String(ts.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = ts.getFullYear();

      var hour = ts.getHours();
      var minute = ts.getMinutes();

      let pa = job.path.replace("C:", "c:");
      let backupfile = `${mm}-${dd}-${yyyy}_${hour}_${minute}-${job.id}`;
      var dir = `${pa}\\${name}`;
      let filepath = `${dir}\\${backupfile}.sql`;

      if (!fs.existsSync(dir)) {
        //Make sure that there is a folder available, if not create one
        fs.mkdirSync(dir);
      }

      await mysqldump({
        connection: {
          host: job.db.host,
          user: job.db.user,
          password: job.db.pass,
          database: job.db.name,
        },
        dumpToFile: filepath,
      });

      let p = new Promise((resolve, reject) => {
        const fileContents = fs.createReadStream(`${filepath}`);
        const writeStream = fs.createWriteStream(`${filepath}.gz`);
        const zip = zlib.createGzip();

        fileContents
          .pipe(zip)
          .pipe(writeStream)
          .on("finish", (err) => {
            if (err) return reject(err);
            else resolve("");
          });
      });

      await p.catch((e) => {
        throw e;
      });

      fs.unlinkSync(filepath);

      return "Completed";
    } catch (e) {
      console.log(e);
      return "Error";
    }
  }

  addScheduleJob(job) {
    let frequency = job.schedule.frequency; //days, weeks, months (daily, monthly, weekly)
    let time = job.schedule.time; //01:00:00 AM

    // parsetime
    time = time.replace(" ", ":");
    let timesplit = time.split(":");

    let hours = Number(timesplit[0]);
    let minutes = Number(timesplit[1]);
    let seconds = Number(timesplit[2]);

    let daytime = timesplit[3];

    if (daytime === "PM") {
      hours = hours + 12;
    }

    let scdl: any = null;

    // parse frequency
    switch (frequency) {
      case "days":
        scdl = { hour: hours, minute: minutes, second: seconds };
        break;
      case "weeks":
        scdl = {
          hour: hours,
          minute: minutes,
          second: seconds,
          dayOfWeek: Number(job.schedule.day),
        };
        break;
      case "months":
        scdl = {
          hour: hours,
          minute: minutes,
          second: seconds,
          dayOfWeek: Number(job.schedule.day),
          date: [1, 2, 3, 4, 5, 6, 7],
        };
        break;
      default:
        break;
    }
    let ts = new Date();

    const schedulejob = schedule.scheduleJob(scdl, async () => {
      let livejobs = this.store.get("jobs");
      livejobs = JSON.parse(livejobs);

      let i = livejobs.findIndex((e) => {
        return e.id === job.id;
      });

      let livejob = livejobs[i];

      let response = "Waiting";
      switch (livejob.service) {
        case "mariadb":
          response = await this.backupSQL(livejob, ts);
          break;
        case "mysql":
          response = await this.backupSQL(livejob, ts);
          break;
        default:
          break;
      }

      // Update records for last run
      livejob.lastrun = ts.toISOString();
      livejob.status = response;

      livejob.expiration = 

      livejobs[i] = livejob;
      this.store.set("jobs", JSON.stringify(livejobs));
    });

    let livejobs = this.store.get("jobs");
    livejobs = JSON.parse(livejobs);

    let i = livejobs.findIndex((e) => {
      return e.id === job.id;
    });

    let livejob = livejobs[i];

    livejobs[i] = livejob;
    this.store.set("jobs", JSON.stringify(livejobs));

    let name = job.name.replaceAll(" ", "-")
    let paths = job.path.replace("C:", "c:")
    var dir = `${paths}\\${name}`;
    // Simple Garbage Collecter
    let garbagecollector = setInterval(() => {
      console.log("Collecting Garbage")
      fs.readdir(dir, function(err, files) {
        if (!files) return

        files.forEach(function(file, index) {
          fs.stat(path.join(dir, file), function(err, stat) {
            var endTime, now;
            if (err) {
              return console.error(err);
            }
            now = new Date().getTime();
            endTime = new Date(stat.ctime).getTime() + 3600000;
            if (now > endTime) {
              return rimraf(path.join(dir, file)).catch((err) => {
                if (err) {
                  return console.error(err);
                }
              })
            }
          });
        });
      });
    }, 360000)
    console.log("Garbage Collector REGISTERED");


    this.schedulejobs.push({
      jobid: job.id,
      scheduled: schedulejob,
      garbage: garbagecollector
    });
    console.log("JOB REGISTERED", job);
  }
}

// expose the class
export default Sceduler;
