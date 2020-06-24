const { BrowserWindow, app } = require("electron").remote
const { ipcRenderer } = require("electron")
const path = require("path")
const mousetrap = require("mousetrap")

const durationField = document.querySelector("#duration")
const toggleButton = document.querySelector("#toggle")

const progressBar = document.querySelector(".bar-item")

let aboutWindow = null
let running = false

mousetrap.bind("enter", function () {
  document.querySelector("#toggle").click()
})

mousetrap.bind("space", function () {
  document.querySelector("#toggle").click()
})

let fieldTrap = new Mousetrap(durationField)
fieldTrap.bind("enter", function (event) {
  if (event.preventDefault) {
    event.preventDefault()
  }
  document.querySelector("#toggle").click()
})

let toggleTrap = new Mousetrap(toggleButton)
toggleTrap.bind("enter", function (event) {
  if (event.preventDefault) {
    event.preventDefault()
  }
  //   document.querySelector("#toggle").click()
})
toggleTrap.bind("space", function (event) {
  if (event.preventDefault) {
    event.preventDefault()
  }
})

toggleButton.addEventListener("click", function () {
  if (running) {
    ipcRenderer.send("stop-timer")
    toggleButton.innerHTML = "Start"
    durationField.removeAttribute("disabled")
  } else {
    ipcRenderer.send("new-timer", durationField.value)
    toggleButton.innerHTML = "Stop"
    durationField.setAttribute("disabled", null)
  }
  running = !running
})

document.querySelector("#about").addEventListener("click", displayAbout)

durationField.addEventListener("input", () => {
  let invalidInput = durationField.matches(":invalid")
  toggleButton.toggleAttribute("disabled", invalidInput)
})

function displayAbout() {
  if (aboutWindow != null) {
    aboutWindow.show()
    return
  }

  // Create the browser window.
  aboutWindow = new BrowserWindow({
    width: 400,
    height: 250,
    autoHideMenuBar: true,
    resizable: false,
    icon: path.join(app.getAppPath(), "./src/assets/logo-black.ico"),
    webPreferences: {
      nodeIntegration: true,
    },
  })

  // and load the index.html of the app.
  aboutWindow.loadFile("src/renderer/about.html")

  // Emitted when the window is closed.
  aboutWindow.on("closed", () => {
    aboutWindow = null
  })
}

ipcRenderer.on("display-about", (event, arg) => {
  displayAbout()
})

ipcRenderer.on("timer-update", (event, arg) => {
  completion = new Number(arg).toFixed(2)

  progressBar.setAttribute("style", `width:${completion}%;`)
})

ipcRenderer.on("timer-stopped", () => {
  progressBar.setAttribute("style", "width:0%;")
})
