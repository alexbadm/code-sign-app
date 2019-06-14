import { AppAction, AppChannel, AppStorageState, WebContents } from 'electron';
import fs from 'fs';
import path from 'path';

let fromFileState = {};
const dirname = path.dirname(process.argv[0]); // __dirname;
const filename = path.join(dirname, 'database.json');
global.databasePath = filename;
console.log('Database path is: "%s"', filename);

try {
  fromFileState = JSON.parse(fs.readFileSync(filename, 'utf8'));
} catch (e) {
  if (e.code === 'ENOENT') {
    fs.writeFileSync(filename, new Uint8Array(0));
  }
}

fs.accessSync(filename, fs.constants.R_OK | fs.constants.W_OK);

export abstract class Storage {
  public static handleIpcMessage(channel: AppChannel, action: AppAction): void {
    const store = Storage.instances[channel];
    if (store && Storage.webContents) {
      Storage.webContents.send(channel, store.ipcMessage(action));
    }
  }

  public static registerWebContents(wc: WebContents): void {
    Storage.webContents = wc;
  }

  public static save(): void {
    try {
      fs.writeFileSync(filename, JSON.stringify(Storage.state, null, 2), 'utf8');
    } catch (e) {
      console.log('failed to save database', e);
    }
  }

  public static sendState(channel: AppChannel): void {
    const store = Storage.instances[channel];
    if (store && Storage.webContents) {
      Storage.webContents.send(channel, store.state);
    }
  }

  private static webContents: WebContents;
  private static readonly state: { [channel: string]: any } = fromFileState;

  private static readonly instances: {
    [channel: string]: Storage;
  } = {};

  protected readonly state: any;

  constructor(protected channel: AppChannel) {
    this.state = Storage.state[channel] = Storage.state[channel] || {};
    console.log('[Storage] <%s> this.state', channel, this.state);
    Storage.instances[channel] = this;
    console.log('Storage instances', Storage.instances);
  }

  public abstract ipcMessage(action: AppAction): AppStorageState;
}
