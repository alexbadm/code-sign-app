"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const birthday_1 = require("./birthday");
const participants_1 = require("./participants");
const teams_1 = require("./teams");
const storage_1 = require("./storage");
new birthday_1.BirthdayStorage();
new participants_1.ParticipantsStorage();
new teams_1.TeamsStorage();
electron_1.app.on('ready', createWindow);
// app.on('before-quit', () => {
//   console.log("app.on('before-quit')");
//   Storage.save();
// });
function createWindow() {
    // const win = new BrowserWindow({ width: 1000, height: 700, frame: false });
    const win = new electron_1.BrowserWindow({
        width: 1300,
        height: 700,
        center: true,
        title: "КЗ База данных турнира",
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.webContents.openDevTools();
    win.webContents.on('ipc-message', (_, channel, args) => {
        console.log("[ipc-message] <%s>", channel, args);
        win.webContents.send(channel, storage_1.Storage.ipcMessage(channel, args));
    });
    win.on('closed', () => {
        console.log("win.on('closed') -> Storage.save()");
        storage_1.Storage.save();
    });
    // win.loadURL(`file://${__dirname}/../build/index.html`);
    win.loadURL('http://localhost:3000');
}
