import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Timer from 'tiny-timer'
import log from 'electron-log/main'

log.initialize({ preload: true })

let mainWindow: BrowserWindow | null = null
const timer = new Timer({ interval: 100 })
let duration: number = 30
const postponeDuration = 3
let notificationWindowsRegister: BrowserWindow[] = []

app.setName('Pause')

app.whenReady().then(() => {
  electronApp.setAppUserModelId('org.thomsch.pause')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setupIpcListeners()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

timer.on('tick', (ms: number) => {
  const n = Number(((1 - ms / timer.duration) * 100).toFixed(2))
  mainWindow?.webContents.send('timer-update', n.toString())
})

timer.on('done', onTimerEnd)

function setupIpcListeners(): void {
  ipcMain.on('display-notification', () => {
    onTimerEnd()
  })

  ipcMain.on('resume', () => {
    closeNotifications()
    startSession(duration)
  })

  ipcMain.on('postpone', () => {
    closeNotifications()
    startSession(postponeDuration)
  })

  ipcMain.on('new-timer', (_event, arg: number) => {
    duration = arg
    startSession(duration)
  })

  ipcMain.on('stop-timer', () => {
    timer.stop()
    resetTimer()
  })
}

function createWindow(): void {
  if (mainWindow != null) {
    mainWindow.show()
    return
  }

  mainWindow = new BrowserWindow({
    width: 400,
    height: 200,
    autoHideMenuBar: true,
    resizable: true,
    show: false,
    icon: join(app.getAppPath(), './build/icons/icon.ico'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    timer.stop()
    closeNotifications()
    mainWindow = null
  })
}

function startSession(dur: number): void {
  log.info(`Starting session with duration ${dur}`)
  if (timer.status !== 'stopped') {
    log.info('Stopping previous timer')
    timer.stop()
  }
  timer.start(dur * 60 * 1000)
}

function closeNotifications(): void {
  log.info(`There are ${notificationWindowsRegister.length} windows to close`)
  for (const window of notificationWindowsRegister) {
    log.info(`Closing window ${JSON.stringify(window, null, 2)}`)
    window.close()
  }
  notificationWindowsRegister = []
}

function resetTimer(): void {
  mainWindow?.webContents.send('timer-stopped')
}

function onTimerEnd(): void {
  const screens = screen.getAllDisplays()
  log.info(`There is ${screens.length} screens detected`)

  for (const display of screens) {
    log.info('Bounds:')
    log.info(display.bounds)
    log.info('Work size area:')
    log.info(display.workAreaSize)

    const notificationWindow = new BrowserWindow({
      width: display.bounds.width,
      height: display.bounds.height,
      x: display.bounds.x,
      y: display.bounds.y,
      show: true,
      frame: false,
      transparent: true,
      fullscreen: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      minimizable: false,
      webPreferences: {
        preload: join(__dirname, '../preload/notification.js'),
        sandbox: false
      }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      notificationWindow.loadURL(
        process.env['ELECTRON_RENDERER_URL'] + '/notification/index.html'
      )
    } else {
      notificationWindow.loadFile(join(__dirname, '../renderer/notification/index.html'))
    }

    notificationWindow.once('ready-to-show', () => {
      notificationWindow.show()
      log.info(`Showing window ${JSON.stringify(notificationWindow, null, 2)}`)
    })

    notificationWindowsRegister.push(notificationWindow)
  }
}
