
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
