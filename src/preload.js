const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  ping: () => ipcRenderer.invoke('ping'),
  stopTimer: () => ipcRenderer.send('stop-timer'),
  startTimer: (duration) => {
    ipcRenderer.send('new-timer', duration)
  },

  handleTimerUpdate: (callback) => ipcRenderer.on('timer-update', callback),
  handleTimerStopped: (callback) => ipcRenderer.on('timer-stopped', callback),

  handleAppUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  handleAppUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),

  restartApp: () => ipcRenderer.send('restart-app')
})

window.addEventListener('DOMContentLoaded', () => {
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector)
  //   if (element) element.innerText = text
  // }

  // for (const dependency of ['chrome', 'node', 'electron']) {
  //   replaceText(`${dependency}-version`, process.versions[dependency])
  // }
})

