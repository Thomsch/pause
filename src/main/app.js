const { app, BrowserWindow, Menu } = require("electron")
const { ipcMain } = require("electron")
const Timer = require("tiny-timer")
const path = require("path")

let win
let timer = new Timer({ interval: 100 })
let duration
let postponeDuration = 3

timer.on("tick", updateTimestamp)
timer.on("done", onTimerEnd)

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
  if (win === null) {
    createWindow()
  }
})

ipcMain.on("display-notification", () => {
  onTimerEnd()
})

ipcMain.on("resume", () => {
  startSession(duration)
})

ipcMain.on("postpone", () => {
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

function startSession(duration) {
  if (timer.status != "stopped") {
    timer.stop()
  }

  timer.start(duration * 60 * 1000)
}

function resetTimer() {
  win.webContents.send("timer-stopped")
}

function updateTimestamp(ms) {
  n = new Number((1 - ms / timer.duration) * 100)

  win.webContents.send("timer-update", n.toString())
}

function createWindow() {
  if (win != null) {
    win.show()
    return
  }

  win = new BrowserWindow({
    width: 400,
    height: 200,
    autoHideMenuBar: true,
    resizable: false,
    icon: path.join(app.getAppPath(), "./src/assets/icon.ico")
  })

  // and load the main.html of the app.
  win.loadFile("./src/renderer/main.html")

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

function onTimerEnd() {
  let win = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    fullscreen: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    minimizable: false
  })
  win.loadFile("./src/renderer/notification.html")

  win.once("ready-to-show", () => {
    win.maximize()
    win.show()
  })

  win.on("closed", () => {
    win = null
  })
}