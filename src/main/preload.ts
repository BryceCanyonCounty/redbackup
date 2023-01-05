import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  pollUpdater: async () => {
    return await ipcRenderer.invoke("pollUpdater");
  },
  getLatestLogs: async () => {
    return await ipcRenderer.invoke("getLatestLogs");
  },
});

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: ipcRenderer,
});
