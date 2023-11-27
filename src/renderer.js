// const { BrowserWindow, app } = require('@electron/remote')
// const { ipcRenderer } = require("electron")
// const path = require("path")
// const mousetrap = require("mousetrap")

__electronLog.info('Log from the renderer');

let completion = new Number(0).toFixed(2)

const func = async () => {
  const response = await window.versions.ping()
  __electronLog.info(response); // prints out 'pong'
}

func()

const durationField = document.querySelector("#duration")
const toggleButton = document.querySelector("#toggle")
const progressBar = document.querySelector(".bar-item")
const message = document.getElementById('update-message');
const updateControls = document.getElementById('update-controls')

let running = false

// setupEventListeners();
setupProcessListeners();

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

function setupProcessListeners() {
  window.versions.handleTimerUpdate((event, value) => {
    // const oldValue = Number(counter.innerText)
    // const newValue = oldValue + value
    // counter.innerText = newValue
    // event.sender.send('counter-value', newValue)

    completion = new Number(value).toFixed(2)

    __electronLog.info(`Received timer update: ${completion}`)
    progressBar.setAttribute("style", `width:${completion}%;`)
  })

  window.versions.handleTimerStopped((event, value) => {
    progressBar.setAttribute("style", "width:0%;")
  })


  // ipcRenderer.on('update-available', () => {
  //   log.info("Received update available")
  //   ipcRenderer.removeAllListeners('update-available');

  //   message.classList.remove('hidden')
  //   message.innerText = 'Downloading update...';
  // });

  // ipcRenderer.on('update-downloaded', () => {
  //   log.info("Received update downloaded")
  //   ipcRenderer.removeAllListeners('update-downloaded');

  //   message.innerText = 'Update Ready';

  //   updateControls.classList.remove('hidden')
  // });
}

// function setupEventListeners() {
  durationField.addEventListener("input", () => {
    let invalidInput = durationField.matches(":invalid")
    toggleButton.toggleAttribute("disabled", invalidInput)
  })

  toggleButton.addEventListener("click", function () {
    __electronLog.info('Clicked');
    if (running) {
      window.versions.stopTimer()

      toggleButton.innerHTML = "Start"
      durationField.removeAttribute("disabled")
    } else {
      window.versions.startTimer(durationField.value)
    
      toggleButton.innerHTML = "Stop"
      durationField.setAttribute("disabled", null)
    }
    running = !running
  })
// }

