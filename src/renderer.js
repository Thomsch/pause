// const { BrowserWindow, app } = require('@electron/remote')
// const { ipcRenderer } = require("electron")
// const path = require("path")
// const mousetrap = require("mousetrap")

__electronLog.info('Log from the renderer');


let information = document.getElementById('info')
console.log(window.versions.chrome())
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

func()

// const durationField = document.querySelector("#duration")
const toggleButton = document.querySelector("#toggle")
// const progressBar = document.querySelector(".bar-item")
// const message = document.getElementById('update-message');
// const updateControls = document.getElementById('update-controls')

// let aboutWindow = null
// let running = false
// // let toggleTrap = new Mousetrap(toggleButton)
// // let fieldTrap = new Mousetrap(durationField)

// // bindShortcuts();
// setupEventListeners();
// // setupProcessListeners();



// function restartLater() {
//   log.info("The update will be installed later")

//   updateControls.classList.add('hidden')
//   message.classList.add('hidden')
// }

// function restartNow() {
//   log.info("Sending restart app.")

//   updateControls.classList.add('hidden')
//   message.classList.add('hidden')

//   ipcRenderer.send('restart-app');
// }

// function setupProcessListeners() {
//   ipcRenderer.on("display-about", (event, arg) => {
//     displayAbout()
//   })

//   ipcRenderer.on("timer-update", (event, arg) => {
//     completion = new Number(arg).toFixed(2)

//     log.info(`Received timer update: ${completion}`)

//     progressBar.setAttribute("style", `width:${completion}%;`)
//   })

//   ipcRenderer.on("timer-stopped", () => {
//     progressBar.setAttribute("style", "width:0%;")
//   })

//   ipcRenderer.on('update-available', () => {
//     log.info("Received update available")
//     ipcRenderer.removeAllListeners('update-available');

//     message.classList.remove('hidden')
//     message.innerText = 'Downloading update...';
//   });

//   ipcRenderer.on('update-downloaded', () => {
//     log.info("Received update downloaded")
//     ipcRenderer.removeAllListeners('update-downloaded');

//     message.innerText = 'Update Ready';

//     updateControls.classList.remove('hidden')
//   });
// }

// function setupEventListeners() {
//   document.querySelector("#about").addEventListener("click", displayAbout)

//   durationField.addEventListener("input", () => {
//     let invalidInput = durationField.matches(":invalid")
//     toggleButton.toggleAttribute("disabled", invalidInput)
//   })

  toggleButton.addEventListener("click", function () {
    console.log("clicked")
    // if (running) {
    //   ipcRenderer.send("stop-timer")
    //   toggleButton.innerHTML = "Start"
    //   durationField.removeAttribute("disabled")
    // } else {
    //   ipcRenderer.send("new-timer", durationField.value)
    //   toggleButton.innerHTML = "Stop"
    //   durationField.setAttribute("disabled", null)
    // }
    // running = !running
  })
// }

// function bindShortcuts() {
//   mousetrap.bind("enter", function () {
//     document.querySelector("#toggle").click()
//   })

//   mousetrap.bind("space", function () {
//     document.querySelector("#toggle").click()
//   })

//   fieldTrap.bind("enter", function (event) {
//     if (event.preventDefault) {
//       event.preventDefault()
//     }
//     document.querySelector("#toggle").click()
//   })

//   toggleTrap.bind("enter", function (event) {
//     if (event.preventDefault) {
//       event.preventDefault()
//     }
//     //   document.querySelector("#toggle").click()
//   })

//   toggleTrap.bind("space", function (event) {
//     if (event.preventDefault) {
//       event.preventDefault()
//     }
//   })
// }

// function displayAbout() {
//   if (aboutWindow != null) {
//     aboutWindow.show()
//     return
//   }

//   // Create the browser window.
//   aboutWindow = new BrowserWindow({
//     width: 400,
//     height: 250,
//     autoHideMenuBar: true,
//     resizable: false,
//     icon: path.join(app.getAppPath(), "./build/icons/icon.ico"),
//     webPreferences: {
//       nodeIntegration: true,
//       enableRemoteModule: true,
//     },
//   })

//   // and load the index.html of the app.
//   aboutWindow.loadFile("src/about/about.html")

//   // Emitted when the window is closed.
//   aboutWindow.on("closed", () => {
//     aboutWindow = null
//   })
// }
