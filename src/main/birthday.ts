import { Storage } from "./storage";
import { IBirthdayState } from './interface';

export class BirthdayStorage extends Storage {
  protected state!: IBirthdayState;

  constructor() {
    super("birthday");
    global.birthday = this.state;
    if (!this.state.fromDate || !this.state.toDate) {
      this.state.fromDate = 1559347200000;
      this.state.toDate = 1567296000000;
    }
  }

  public ipcMessage([channel, type, newDate]: ['birthday', 'fromDate' | 'toDate', number]): IBirthdayState {
    if (channel !== this.channel) {
      return this.state;
    }
    this.state[type] = newDate;
    console.log('[BirthdayStorage] ipcMessage event', [channel, type, newDate]);
    return this.state;
  }
}
