import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Aquí puedes exponer APIs seguras al renderer process
})
