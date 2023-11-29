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
