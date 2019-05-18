import fs from 'fs';
import path from 'path';

let fromFileState = {};
const filename = path.join(__dirname, 'database.json');
try {
  fromFileState = JSON.parse(fs.readFileSync(filename, 'utf8'));
} catch (e) {
  console.log('failed to load database', e);
}

export abstract class Storage {
  public static ipcMessage(channel: string, input: any[]): any {
    const match = Storage.instances[channel];
    return match
      ? match.ipcMessage(input)
      : console.log('[Storage.ipcMessage] not implemented for "%s" channel', channel);
  }

  public static save(): void {
    try {
      fs.writeFileSync(filename, JSON.stringify(Storage.state, null, 2), 'utf8');
    } catch (e) {
      console.log('failed to save database', e);
    }
  }

  private static readonly state: { [channel: string]: any } = fromFileState;

  private static readonly instances: {
    [channel: string]: Storage;
  } = {};

  protected readonly state: any;

  constructor(protected channel: string) {
    this.state = Storage.state[channel] = Storage.state[channel] || {};
    console.log('[Storage] <%s> this.state', channel, this.state);
    Storage.instances[channel] = this;
    console.log('Storage instances', Storage.instances);
  }

  public abstract ipcMessage(...args: any[]): any;
}
