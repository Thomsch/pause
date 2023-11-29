const electron = require("electron")
const { app, BrowserWindow, Menu, ipcMain } = electron

const Timer = require("tiny-timer")
const path = require('node:path')
const log = require('electron-log/main');

// Optional, initialize the logger for any renderer process
log.initialize({ preload: true });

let mainWindow
let timer = new Timer({ interval: 100 })
let duration
let postponeDuration = 3
let notificationWindowsRegister = []

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

setupProcessListeners();

timer.on("tick", updateTimestamp)
timer.on("done", onTimerEnd)

function setupProcessListeners() {
  ipcMain.on("display-notification", () => {
    onTimerEnd()
  })

  ipcMain.on("resume", () => {
    closeNotifications()
    startSession(duration)
  })

  ipcMain.on("postpone", () => {
    closeNotifications()
    startSession(postponeDuration)
  })

  ipcMain.on("new-timer", (event, arg) => {
    duration = arg

    startSession(duration)
  })

  ipcMain.on("stop-timer", () => {
    timer.stop()
    resetTimer()
  })
}

function createWindow() {
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
    icon: path.join(app.getAppPath(), "./build/icons/icon.ico"),
    webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, 'preload.js'),
      }
  })

  // and load the main.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    timer.stop()
    closeNotifications()

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
}

function startSession(duration) {
  if (timer.status != "stopped") {
    timer.stop()
  }

  timer.start(duration * 60 * 1000)
}

function updateTimestamp(ms) {
  n = new Number((1 - ms / timer.duration) * 100)
  mainWindow.webContents.send("timer-update", n.toString())
}

function closeNotifications() {
  for (let window of notificationWindowsRegister) {
    window.close()
  }
  notificationWindowsRegister = []
}

function resetTimer() {
  mainWindow.webContents.send("timer-stopped")
}

function onTimerEnd() {
  const screenApi = electron.screen
  let screens = screenApi.getAllDisplays()

  log.info(`There is ${screens.length} screens detected`)

  for (var screen of screens) {
    log.info(`Bounds:`)
    log.info(screen.bounds)
    log.info(`Work size area:`)
    log.info(screen.workAreaSize)

    let notificationWindow = new BrowserWindow({
      width: screen.bounds.width,
      height: screen.bounds.height,
      x: screen.bounds.x,
      y: screen.bounds.y,
      show: false,
      frame: true,
      transparent: true,
      fullscreen: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      minimizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    })
    notificationWindow.loadFile("./src/notification/notification.html")

    notificationWindow.once("ready-to-show", () => {
      notificationWindow.maximize()
      notificationWindow.show()
    })

    notificationWindow.on("closed", () => {
      notificationWindow = null
    })

    notificationWindowsRegister.push(notificationWindow)
  }
}
