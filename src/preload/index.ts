import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  startTimer: (duration: number): void => {
    ipcRenderer.send('new-timer', duration)
  },
  stopTimer: (): void => {
    ipcRenderer.send('stop-timer')
  },
  onTimerUpdate: (callback: (value: string) => void): void => {
    ipcRenderer.on('timer-update', (_event, value) => callback(value))
  },
  onTimerStopped: (callback: () => void): void => {
    ipcRenderer.on('timer-stopped', () => callback())
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
