const {BrowserWindow} = require('electron').remote
const { ipcRenderer } = require('electron')

const progress = document.querySelector("#progress");
const progress_bar = document.querySelector("#progress-bar");
const start_button = document.querySelector("#start");
const duration_field = document.querySelector("#duration");


document.querySelector("#notification").addEventListener('click', function () { 
    ipcRenderer.send('display-notification')
})

document.querySelector("#start").addEventListener('click', function () { 
    ipcRenderer.send('new-timer', duration_field.value)
})


document.querySelector("#stop").addEventListener('click', function () { 
    ipcRenderer.send('stop-timer')
})

ipcRenderer.on('timer-update', (event, arg) => {
    completion = new Number(arg).toFixed(2)
    progress.innerHTML = `${completion}%`
    progress_bar.value = completion
})

ipcRenderer.on('timer-stopped', () => {
    progress.innerHTML = ''
    progress_bar.value = 0
})
