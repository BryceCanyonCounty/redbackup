import { contextBridge, ipcRenderer } from "electron";

// This is the bridge that allows the renderer to talk back and forth to the main process
contextBridge.exposeInMainWorld("api", {
  pollUpdater: async () => {
    return await ipcRenderer.invoke("pollUpdater");
  },
  getLatestLogs: async () => {
    return await ipcRenderer.invoke("getLatestLogs");
  },
  saveSettings: async (args) => {
    return await ipcRenderer.invoke("saveSettings", args);
  },
  getSettings: async (args) => {
    return await ipcRenderer.invoke("getSettings", args);
  },
  createJob: async (args) => {
    return await ipcRenderer.invoke("createJob", args);
  },
  updateJob: async (args) => {
    return await ipcRenderer.invoke("updateJob", args);
  },
  getJobs: async (args) => {
    return await ipcRenderer.invoke("getJobs", args);
  },
  getJob: async (args) => {
    return await ipcRenderer.invoke("getJob", args);
  },
  remJob: async (args) => {
    return await ipcRenderer.invoke("remJob", args);
  },
  selectDir: async (args) => {
    return await ipcRenderer.invoke("select-dirs", args);
  }
});

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: ipcRenderer,
});
