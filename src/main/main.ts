import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  safeStorage,
  dialog,
  Menu,
  Tray,
  nativeImage
} from "electron";
import { join } from "path";
import { autoUpdater } from "electron-updater";
import log from "electron-log";

import store from "./store.js";
import scheduler from './scheduler'

let logs: any = [];
var Store;
var Scheduler;
let appIcon: any = null;
let trueClose = false;
var contextMenu
autoUpdater.logger = log;

let mainWindow;

app.disableHardwareAcceleration();
const gotTheLock = app.requestSingleInstanceLock();

// Prevent user from opening a duplicate window
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function sendStatusToWindow(text) {
  logs.push(text);
  log.info(text);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: "hidden",
    resizable: false,
  });

  if (process.env.NODE_ENV === "development") {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools({ mode: "undocked" });
    mainWindow.setIcon(join(__dirname, "static/icon.png"));
  } else {
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
    // mainWindow.webContents.openDevTools({mode: 'undocked'});
  }

  mainWindow.on("close", (event) => {
    if (!trueClose) {
      event.preventDefault(); //this prevents it from closing. The `closed` event will not fire now
      mainWindow.hide();
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    sendStatusToWindow("App starting...");
  });
}

app.whenReady().then(() => {
  createWindow();

  Store = new store({
    hasKeyChain: safeStorage.isEncryptionAvailable(),
    configName: "redcloudstore",
    defaults: {},
  });

  Scheduler = new scheduler({
    store: Store
  })

  let Settings = Store.get("settings");
  if (Settings) {
    Settings = JSON.parse(Settings);
  } else {
    Settings = {
      path: '',
      startup: false,
      minimized: false
    }
    Store.set("settings", JSON.stringify(Settings));
  }


  let jobs = Store.get("jobs");
  if (!jobs) {
    Store.set("jobs", '[]')
  }

  appIcon = new Tray(nativeImage.createFromDataURL('data:image/png;base64,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'));
  
  contextMenu = Menu.buildFromTemplate([
    {
      label: "Open App",
      type: "normal",
      click() {
        mainWindow.show();
      },
    },
    {
      label: "Run on Startup",
      type: "checkbox",
      click(data) {
        let tempsettings = Store.get("settings");
        if (tempsettings) {
          tempsettings = JSON.parse(tempsettings);
          Settings = tempsettings;
          tempsettings.startup = data.checked;
          Store.set("settings", JSON.stringify(tempsettings));
        } else {
          let defaultsettings = {
            path: "",
            startup: data.checked,
            minimized: false,
          };
          Settings = defaultsettings;
          Store.set("settings", JSON.stringify(defaultsettings));
        }

        app.setLoginItemSettings({
          openAtLogin: Settings.startup,
        });
      },
    },
    {
      label: "Exit",
      type: "normal",
      click() {
        trueClose = true;
        mainWindow.close();
      },
    },
    { type: 'separator' },
    {
      label: app.getVersion(),
      type: "normal"
    }
  ]);

  // Make a change to the context menu
  contextMenu.items[1].checked = Settings.startup;
  appIcon.setContextMenu(contextMenu);
  
  app.setLoginItemSettings({
    openAtLogin: Settings.startup,
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  Scheduler.start()
});

// Disable common browser shortcuts
app.on("browser-window-focus", function () {
  globalShortcut.register("CommandOrControl+R", () => {
    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
    console.log("F5 is pressed: Shortcut Disabled");
  });
});

app.on("browser-window-blur", function () {
  globalShortcut.unregister("CommandOrControl+R");
  globalShortcut.unregister("F5");
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("pollUpdater", async (event, arg) => {
  autoUpdater.checkForUpdatesAndNotify();
  return "";
});

ipcMain.handle("getLatestLogs", async (event, arg) => {
  let outlogs = logs;
  logs = [];

  return outlogs;
});

ipcMain.on("closeWindow", (event, message) => {
  trueClose = false;
  mainWindow.close();
});

ipcMain.on("minimizeWindow", (event, message) => {
  mainWindow.minimize();
});

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded");
});

// API Connectors from renderer to this
ipcMain.handle("saveSettings", async (event, args) => {
  let stg = JSON.parse(args)
  contextMenu.items[1].checked = stg.startup;

  return Store.set("settings", args);
});

// API Connectors from renderer to this
ipcMain.handle("getSettings", async (event, args) => {
  return Store.get("settings");
});

// API Connectors from renderer to this
ipcMain.handle("getJobs", async (event, args) => {
  return Store.get("jobs");
});

// API Connectors from renderer to this
ipcMain.handle("getJob", async (event, pos) => {
  let temp = Store.get("jobs");
  if (!temp) return null;
  let t = JSON.parse(temp);
  return t[pos];
});

// API Connectors from renderer to this
ipcMain.handle("createJob", async (event, job) => {
  let jobs = Store.get("jobs");
  if (!jobs) jobs = `[]`;

  jobs = JSON.parse(jobs);
  let pjob = JSON.parse(job)

  Scheduler.addScheduleJob(pjob)
  
  jobs.push(pjob);
  return Store.set("jobs", JSON.stringify(jobs));
});

ipcMain.handle("updateJob", async (event, payload) => {
  let pyld = JSON.parse(payload);
  let temp = Store.get("jobs");
  let jobs = JSON.parse(temp);
  jobs[pyld.pos] = pyld.data;

  return Store.set("jobs", JSON.stringify(jobs));
});

// API Connectors from renderer to this
ipcMain.handle("remJob", async (event, payload) => {
  payload = JSON.parse(payload);


  let pos = payload.pos;
  let temp = Store.get("jobs");
  if (!temp) return null;

  let jobs = JSON.parse(temp);
  jobs.splice(pos, 1);

  Scheduler.deleteScheduleJob(payload.id)

  return Store.set("jobs", JSON.stringify(jobs));
});

ipcMain.handle("select-dirs", async (event, dir) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  return "directories selected" + result.filePaths;
});
