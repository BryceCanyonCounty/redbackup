// TODO: Convert this to TS

const electron = require("electron");
const path = require("path");
const fs = require("fs");
var crypto = require("crypto");

const safeStorage = electron.safeStorage;
// storage enc

class Store {
  constructor(opts) {
    this.hasKeyChain = opts.hasKeyChain;

    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath(
      "userData"
    );
    console.log((electron.app || electron.remote.app).getPath("userData"));
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + ".json");

    this.data = parseDataFile(this.path, opts.defaults);
    // Use filestore instead
    let kpath = path.join(userDataPath, "lk");
    try {
      let tk = fs.readFileSync(kpath);
      if (this.hasKeyChain) {
      let dc = safeStorage.decryptString(tk);
      this.k = Buffer.from(dc, "hex");
      } else {
        this.k = tk
      }
    } catch (e) {
      let tk = crypto.randomBytes(32);
      if (this.hasKeyChain) {
        this.k = safeStorage.encryptString(tk.toString("hex"));
      } else {
        this.k = tk;
      }

      fs.writeFileSync(kpath, this.k);
    }
  }

  // This will just return the property on the `data` object
  get(key) {
    let h = this.data[key];

    if (!h) {
      return;
    }

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      this.k,
      Buffer.from(h.iv, "hex")
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(h.content, "hex")),
      decipher.final(),
    ]);

    return decrpyted.toString();
  }

  // ...and this will set it
  set(key, val) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", this.k, iv);

    let encryptedData = cipher.update(val, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    this.data[key] = {
      iv: iv.toString("hex"),
      content: encryptedData,
    };

    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data));
      return "done";
    } catch (e) {
      console.error(e);
      return "error";
    }
  }
}

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

// expose the class
module.exports = Store;
