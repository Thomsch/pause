"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// include the Node.js 'path' module at the top of your file
var node_path_1 = __importDefault(require("node:path"));
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, 'preload.js')
        }
    });
    win.loadFile(node_path_1.default.join(__dirname, "../index.html"));
};
electron_1.app.whenReady().then(function () {
    createWindow();
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
//# sourceMappingURL=main.js.map