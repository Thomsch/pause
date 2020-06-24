const electron = require("electron")
const { app, BrowserWindow, Menu, ipcMain } = electron
const Timer = require("tiny-timer")
const path = require("path")

let mainWindow
let timer = new Timer({ interval: 100 })
let duration
let postponeDuration = 3
let notificationWindowsRegister = []

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
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
    resizable: false,
    icon: path.join(app.getAppPath(), "./src/assets/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
    },
  })

  // and load the main.html of the app.
  mainWindow.loadFile("./src/renderer/main.html")

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    timer.stop()
    closeNotifications()

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
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

  console.log(`There is ${screens.length} screens detected`)

  for (var screen of screens) {
    console.log(`Bounds:`)
    console.log(screen.bounds)
    console.log(`Work size area:`)
    console.log(screen.workAreaSize)

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
      },
    })
    notificationWindow.loadFile("./src/renderer/notification.html")

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
