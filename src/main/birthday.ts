import { Storage } from './storage';
import { AppBirthdayState, AppBirthdayAction } from 'electron';

export class BirthdayStorage extends Storage {
  protected readonly state!: AppBirthdayState;

  constructor() {
    super('birthday');
    global.birthday = this.state;
    if (!this.state.fromDate || !this.state.toDate) {
      this.state.fromDate = 1559347200000;
      this.state.toDate = 1567296000000;
    }
  }

  public ipcMessage(args: AppBirthdayAction): AppBirthdayState {
    this.state[args.type] = args.newDate;
    console.log('[BirthdayStorage] ipcMessage event', args);
    return this.state;
  }
}
