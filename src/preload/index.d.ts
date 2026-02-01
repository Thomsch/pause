import { ElectronAPI } from '@electron-toolkit/preload'

interface PauseAPI {
  startTimer: (duration: number) => void
  stopTimer: () => void
  onTimerUpdate: (callback: (value: string) => void) => void
  onTimerStopped: (callback: () => void) => void
  openExternal: (url: string) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: PauseAPI
  }
}
