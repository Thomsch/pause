const { BrowserWindow } = require("electron").remote
const { ipcRenderer } = require("electron")

const progress = document.querySelector("#progress")
const progress_bar = document.querySelector("#progress-bar")
const start_button = document.querySelector("#start")
const duration_field = document.querySelector("#duration")

document.querySelector("#notification").addEventListener("click", function() {
  ipcRenderer.send("display-notification")
})

document.querySelector("#start").addEventListener("click", function() {
  ipcRenderer.send("new-timer", duration_field.value)
})

document.querySelector("#stop").addEventListener("click", function() {
  ipcRenderer.send("stop-timer")
})

document.querySelector("#about").addEventListener("click", function() {
  // Create the browser window.
  var win = new BrowserWindow({
    width: 400,
    height: 300
  })

  // and load the index.html of the app.
  win.loadFile("src/renderer/about.html")
  win.setMenu(null)

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
})

ipcRenderer.on("timer-update", (event, arg) => {
  completion = new Number(arg).toFixed(2)
  progress.innerHTML = `${completion}%`
  progress_bar.value = completion
})

ipcRenderer.on("timer-stopped", () => {
  progress.innerHTML = ""
  progress_bar.value = 0
})
