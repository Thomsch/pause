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

function hideUpdateControls() {
  updateControls.classList.add('hidden')
  message.classList.add('hidden')
}

function restartLater() {
  __electronLog.info("The update will be installed later")
  hideUpdateControls()
}

function restartNow() {
  __electronLog.info("Sending restart app.")
  hideUpdateControls()
  window.versions.restartApp()
}

window.versions.handleAppUpdateAvailable((event, value) => {
  message.classList.remove('hidden')
  message.innerText = 'Update available. Downloading...';
})

window.versions.handleAppUpdateDownloaded((event, value) => {
  message.innerText = 'Update ready.';
  updateControls.classList.remove('hidden')
})

window.versions.handleTimerUpdate((event, value) => {
  completion = new Number(value).toFixed(2)

  progressBar.setAttribute("style", `width:${completion}%;`)
})

window.versions.handleTimerStopped((event, value) => {
  progressBar.setAttribute("style", "width:0%;")
})


//
// Listeners for the controls
//

durationField.addEventListener("input", () => {
  let invalidInput = durationField.matches(":invalid")
  toggleButton.toggleAttribute("disabled", invalidInput)
})

toggleButton.addEventListener("click", function () {
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
