import { app, AppAction, AppChannel, BrowserWindow } from 'electron';
import { BirthdayStorage } from './birthday';
import { ParticipantsStorage } from './participants';
import { Storage } from './storage';
import { TeamsStorage } from './teams';

new BirthdayStorage();
new ParticipantsStorage();
new TeamsStorage();
app.on('ready', createWindow);
// app.on('before-quit', () => {
//   console.log("app.on('before-quit')");
//   Storage.save();
// });

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 700,
    center: true,
    title: 'КЗ База данных турнира',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.webContents.on('ipc-message', (_, channel: AppChannel, action: AppAction) => {
    console.log('[ipc-message] <%s>', channel, action);
    Storage.handleIpcMessage(channel, action);
    // win.webContents.send(channel, Storage.ipcMessage(channel, action));
  });

  win.on('closed', () => {
    console.log("win.on('closed') -> Storage.save()");
    Storage.save();
  });

  Storage.registerWebContents(win.webContents);

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
    win.loadURL('http://localhost:3000');
  } else {
    win.loadURL(`file://${__dirname}/../build/index.html`);
  }
}
