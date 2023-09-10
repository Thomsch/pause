import { app, BrowserWindow } from 'electron'
// include the Node.js 'path' module at the top of your file
import path from 'node:path'

const createWindow = () => {
    const goldenRatio: number = 1.618;
    const windowWidth: number = 250;
    const windowHeight = Math.round(windowWidth * goldenRatio); // Result needs to be an integer otherwise the height default to 600.

    console.log(`window size: ${windowWidth} ${windowHeight}`);

    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
          }
    })

    win.loadFile(path.join(__dirname, "../index.html"));
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


