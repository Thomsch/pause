const { app, BrowserWindow, Tray, Menu } = require("electron")
const { ipcMain } = require("electron")
const Timer = require("tiny-timer")

let win
let timer = new Timer()

timer.on("tick", updateTimestamp)
timer.on("done", onTimerEnd)

app.on("ready", createWindow)
app.on("ready", top)

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

ipcMain.on("resume", (event, arg) => {
  win.webContents.send("next-timer", arg)
})

ipcMain.on("new-timer", (event, arg) => {
  if (timer.status != "stopped") {
    timer.stop()
  }

  timer.start(arg * 1000)
})

ipcMain.on("stop-timer", (event, arg) => {
  timer.stop()
  resetTimer()
})

function resetTimer() {
  win.webContents.send("timer-stopped")
}

function updateTimestamp(ms) {
  n = new Number((1 - ms / timer.duration) * 100)

  win.webContents.send("timer-update", n.toString())
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile("src/renderer/index.html")

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
    minimizable: false,
    menu: {}
  })
  win.loadFile("src/renderer/notification.html")

  win.once("ready-to-show", () => {
    win.show()
  })

  win.on("closed", () => {
    win = null
  })
}

function top() {
  let tray = new Tray("src/assets/icon-tray.png")
  let trayMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: function() {
        createWindow()
      }
    },

    {
      label: "About",
      click: function() {
        console.log("Clicked on About")
      }
    }
  ])

  tray.setContextMenu(trayMenu)
  tray.setToolTip(app.getName())

  tray.on("click", () => {
    createWindow()
  })
}
