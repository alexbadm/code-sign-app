import { app, BrowserWindow } from "electron";
import { BirthdayStorage } from "./birthday";
import { ParticipantsStorage } from "./participants";
import { TeamsStorage } from "./teams";
import { Storage } from "./storage";

new BirthdayStorage();
new ParticipantsStorage();
new TeamsStorage();
app.on('ready', createWindow);
// app.on('before-quit', () => {
//   console.log("app.on('before-quit')");
//   Storage.save();
// });

function createWindow() {
  // const win = new BrowserWindow({ width: 1000, height: 700, frame: false });

  const win = new BrowserWindow({
    width: 1300,
    height: 700,
    center: true,
    title: "КЗ База данных турнира",
  });
  win.webContents.openDevTools();

  win.webContents.on('ipc-message', (event, input) => {
    console.log("[ipc-message]", event, input);
    win.webContents.send(input[0], Storage.ipcMessage(input));
  });
  win.on('closed', () => {
    console.log("win.on('closed') -> Storage.save()");
    Storage.save();
  });

  win.loadURL(`file://${__dirname}/../build/index.html`);
  // win.loadURL('http://localhost:3000');
}
