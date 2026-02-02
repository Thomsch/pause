import { contextBridge, ipcRenderer } from 'electron'

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
  },
  openExternal: (url: string): void => {
    ipcRenderer.send('open-external', url)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore -- fallback for non-isolated context
  window.api = api
}
