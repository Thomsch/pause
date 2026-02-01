import { ElectronAPI } from '@electron-toolkit/preload'

interface PauseAPI {
  startTimer: (duration: number) => void
  stopTimer: () => void
  onTimerUpdate: (callback: (value: string) => void) => void
  onTimerStopped: (callback: () => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: PauseAPI
  }
}
