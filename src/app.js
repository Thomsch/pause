const { BrowserWindow, app } = require("electron").remote
const { ipcRenderer } = require("electron")
const path = require("path")
const mousetrap = require("mousetrap")

const durationField = document.querySelector("#duration")
const toggleButton = document.querySelector("#toggle")
const progressBar = document.querySelector(".bar-item")

let aboutWindow = null
let running = false
let toggleTrap = new Mousetrap(toggleButton)
let fieldTrap = new Mousetrap(durationField)

bindShortcuts();
setupEventListeners();
setupProcessListeners();

function setupProcessListeners() {
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
}

function setupEventListeners() {
  document.querySelector("#about").addEventListener("click", displayAbout)

  durationField.addEventListener("input", () => {
    let invalidInput = durationField.matches(":invalid")
    toggleButton.toggleAttribute("disabled", invalidInput)
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
}

function bindShortcuts() {
  mousetrap.bind("enter", function () {
    document.querySelector("#toggle").click()
  })

  mousetrap.bind("space", function () {
    document.querySelector("#toggle").click()
  })

  fieldTrap.bind("enter", function (event) {
    if (event.preventDefault) {
      event.preventDefault()
    }
    document.querySelector("#toggle").click()
  })

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
}

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
  aboutWindow.loadFile("src/about/about.html")

  // Emitted when the window is closed.
  aboutWindow.on("closed", () => {
    aboutWindow = null
  })
}