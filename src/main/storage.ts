import fs from 'fs';
import path from 'path';
import { WebContents, AppChannel, AppAction, AppStorageState } from 'electron';

let fromFileState = {};
const filename = path.join(__dirname, 'database.json');
try {
  fromFileState = JSON.parse(fs.readFileSync(filename, 'utf8'));
} catch (e) {
  console.log('failed to load database', e);
}

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
