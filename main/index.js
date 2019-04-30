const { app, BrowserWindow, ipcMain } = require("electron");
const birthday = require("./birthday");

function createWindow() {
  // const win = new BrowserWindow({ width: 1000, height: 700, frame: false });

  const win = new BrowserWindow({
    width: 1300,
    height: 700,
    center: true,
    title: "КЗ База данных турнира",
  });
  win.webContents.openDevTools();

  // win.loadURL(`file://${__dirname}/../build/index.html`);
  win.loadURL('http://localhost:3000');

  console.log(win.webContents);
  win.webContents.on('ipc-message', (event, input) => {
    console.log("[ipc-message]", input);
    switch (input[0]) {
      case "birthday":
        win.webContents.send(input[0], birthday.onChange(input.slice(1)));
        break;
      default:
        console.log("unexpected message", input);
    }
  });
}

birthday.init();
require("./participants")();
require("./teams")();
app.on('ready', createWindow);
