import {app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import {join} from 'path';
import {execFile} from 'child_process'
import { autoUpdater } from "electron-updater"
import log from 'electron-log'
import installExtension from 'electron-devtools-installer';

autoUpdater.logger = log;

let mainWindow
app.disableHardwareAcceleration();
const gotTheLock = app.requestSingleInstanceLock()

// Prevent user from opening a duplicate window
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
    
  // Create myWindow, load the rest of the app, etc...
  app.on('ready', () => {
  })
}

let logs:any = []

function sendStatusToWindow(text) {
  logs.push(text)
  log.info(text);
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'hidden',
    resizable: false
  });
  
  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools({mode: 'undocked'});
    mainWindow.setIcon(join(__dirname,'static/icon.png'));
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
    // mainWindow.webContents.openDevTools({mode: 'undocked'});
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    sendStatusToWindow('App starting...');
  })
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.whenReady().then(() => {
  installExtension('nhdogjmejiglipccpnnnanhbledajbpd') //This id is the ID of the devtool extension (https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));
  createWindow();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Disable common browser shortcuts
app.on('browser-window-focus', function () {
  globalShortcut.register("CommandOrControl+R", () => {
      console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
      console.log("F5 is pressed: Shortcut Disabled");
  });
});

app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.unregister('F5');
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.handle('pollUpdater', async (event, arg) => {
  autoUpdater.checkForUpdatesAndNotify();
  return ''
})

ipcMain.handle('getLatestLogs', async (event, arg) => {
  let outlogs = logs
  logs = []
  
  return outlogs
})

ipcMain.on('closeWindow', (event, message) => {
  mainWindow.close()
})

ipcMain.on('minimizeWindow', (event, message) => {
  mainWindow.minimize();
})

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});