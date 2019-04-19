const { app, BrowserWindow } = require("electron");

function createWindow() {
  // const win = new BrowserWindow({ width: 1000, height: 700, frame: false });

  const win = new BrowserWindow({ width: 1300, height: 700, frame: false });
  win.webContents.openDevTools();

  // win.loadURL(`file://${__dirname}/build/index.html`);
  win.loadURL('http://localhost:3000');
}

app.on('ready', createWindow);
