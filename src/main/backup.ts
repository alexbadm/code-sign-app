import { AppBackupAction, AppBackupState } from 'electron';
import { Storage } from './storage';

export class BackupStorage extends Storage {
  constructor() {
    super('backup');
    global.birthday = this.state;
  }

  public ipcMessage(action: AppBackupAction): AppBackupState {
    if (action.type === 'restore') {
      console.log('[BackupStorage] ipcMessage restore event');
      return Storage.restoreGlobalState(action.data);
    }

    console.log('[BackupStorage] ipcMessage unknown event', action);
    return {
      lastRestoreStatus: 'ok',
      message: '',
    };
  }
}
