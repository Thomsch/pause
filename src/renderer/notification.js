const remote = require("electron").remote
const { ipcRenderer } = require("electron")

var resume = document.querySelector("#resume")
var postpone = document.querySelector("#postpone")

resume.addEventListener("click", function() {
  ipcRenderer.send("resume")

  closeWindow()
})

postpone.addEventListener("click", function() {
  ipcRenderer.send("postpone")

  closeWindow()
})

function closeWindow() {
  var window = remote.getCurrentWindow()
  window.close()
}
