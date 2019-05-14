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
    });
    win.webContents.openDevTools();
    win.webContents.on('ipc-message', (event, input) => {
        console.log("[ipc-message]", event, input);
        win.webContents.send(input[0], storage_1.Storage.ipcMessage(input));
    });
    win.on('closed', () => {
        console.log("win.on('closed') -> Storage.save()");
        storage_1.Storage.save();
    });
    win.loadURL(`file://${__dirname}/../build/index.html`);
    // win.loadURL('http://localhost:3000');
}
