import { app, BrowserWindow, ipcMain, screen, session, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Timer from 'tiny-timer'
import log from 'electron-log/main'

log.initialize()

let mainWindow: BrowserWindow | null = null
const timer = new Timer({ interval: 100 })
let duration: number = 30
const postponeDuration = 3
let notificationWindowsRegister: BrowserWindow[] = []

app.setName('Pause')

app.whenReady().then(() => {
  electronApp.setAppUserModelId('org.thomsch.pause')

  // Deny all permission requests - timer app needs no special permissions
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    log.warn(`Permission request denied: ${permission}`)
    callback(false)
  })

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

function isValidDuration(duration: number): boolean {
  return (
    typeof duration === 'number' && Number.isFinite(duration) && duration > 0 && duration <= 1440 // Max 24 hours
  )
}

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
    if (!isValidDuration(arg)) {
      log.error('Invalid timer duration received:', arg)
      return
    }
    duration = arg
    startSession(duration)
  })

  ipcMain.on('open-external', (_event, url: string) => {
    try {
      const parsedUrl = new URL(url)
      const allowedDomains = ['github.com', 'www.github.com']

      if (parsedUrl.protocol !== 'https:') {
        log.warn('Only HTTPS URLs are allowed:', url)
        return
      }

      if (!allowedDomains.includes(parsedUrl.hostname)) {
        log.warn('Domain not allowed:', parsedUrl.hostname)
        return
      }

      shell.openExternal(url)
    } catch (error) {
      log.error('Invalid URL:', error)
    }
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
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false
    }
  })

  // Prevent navigation to external sites
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      const allowedOrigin = new URL(process.env['ELECTRON_RENDERER_URL']).origin
      if (parsedUrl.origin === allowedOrigin) {
        return
      }
    }

    log.warn('Navigation blocked:', navigationUrl)
    event.preventDefault()
  })

  // Prevent opening new windows
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    log.warn('Window open blocked:', url)
    return { action: 'deny' }
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
        sandbox: true,
        contextIsolation: true,
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false
      }
    })

    // Notification windows should never navigate
    notificationWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      log.warn('Notification navigation blocked:', navigationUrl)
      event.preventDefault()
    })

    notificationWindow.webContents.setWindowOpenHandler(({ url }) => {
      log.warn('Notification window open blocked:', url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      notificationWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/notification/index.html')
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
