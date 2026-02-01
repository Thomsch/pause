import { contextBridge, ipcRenderer } from 'electron'

const notificationApi = {
  resume: (): void => {
    ipcRenderer.send('resume')
  },
  postpone: (): void => {
    ipcRenderer.send('postpone')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('notificationApi', notificationApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.notificationApi = notificationApi
}
