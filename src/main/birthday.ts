import { AppBirthdayAction, AppBirthdayState } from 'electron';
import { Storage } from './storage';

export class BirthdayStorage extends Storage {
  protected readonly state!: AppBirthdayState;

  constructor() {
    super('birthday');
    global.birthday = this.state;
    if (!this.state.fromDate || !this.state.toDate) {
      this.state.fromDate = { day: 1, month: 5 };
      this.state.toDate = { day: 31, month: 7 };
    }
  }

  public ipcMessage(args: AppBirthdayAction): AppBirthdayState {
    this.state[args.type] = args.newDate;
    console.log('[BirthdayStorage] ipcMessage event', args);
    return this.state;
  }
}
