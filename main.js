const { app, BrowserWindow, ipcMain } = require("electron");

function createWindow() {
  // const win = new BrowserWindow({ width: 1000, height: 700, frame: false });

  const win = new BrowserWindow({ width: 1300, height: 700, frame: false });
  win.webContents.openDevTools();

  win.loadURL(`file://${__dirname}/build/index.html`);
  // win.loadURL('http://localhost:3000');
}

ipcMain.on('app-control', (...args) => {
  console.log('app-control args', args);
  process.exit(0);
});

app.on('ready', createWindow);
