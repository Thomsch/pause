var appVersion = require('electron').remote.app.getVersion();

const version = document.querySelector("#version");

version.innerHTML = appVersion