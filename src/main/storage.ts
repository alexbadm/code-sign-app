import fs from 'fs';
import path from 'path';

let state = {};
const filename = path.join(__dirname, "database.json");
try {
  state = JSON.parse(fs.readFileSync(filename, "utf8"));
} catch (e) {
  console.log("failed to load database", e);
}

export class Storage {
  public static ipcMessage(input: any[]): any {
    return Storage.instances[input[0]] && Storage.instances[input[0]].ipcMessage(input);
  }

  public static save(): void {
    try {
      fs.writeFileSync(filename, JSON.stringify(Storage.state, null, 2), "utf8");
    } catch (e) {
      console.log("failed to save database", e);
    }
  }

  private static state: { [channel: string]: any } = state;

  private static instances: {
    [storage: string]: Storage;
  } = {};

  protected state: any;

  constructor(protected channel: string) {
    this.state = Storage.state[channel] = Storage.state[channel] || {};
    console.log("[Storage] this.state", this.state);
    Storage.instances[channel] = this;
    console.log("Storage instances", Storage.instances);
  }

  public ipcMessage(input: any[]): any {
    console.log('[Storage.ipcMessage] not implemented for "%s" channel', input[0]);
    return undefined;
  }
}
