import { Storage } from './storage';
import { AppParticipantsState, AppParticipantsAction } from 'electron';

export class ParticipantsStorage extends Storage {
  protected readonly state!: AppParticipantsState;

  constructor() {
    super('participants');
    global.participants = this.state;
    if (!this.state.items) {
      this.state.items = [];
    }
  }

  public ipcMessage(args: AppParticipantsAction): AppParticipantsState {
    console.log('[ParticipantsStorage] ipcMessage event', args);
    switch (args.type) {
      case 'addParticipant':
        this.state.items.push(args.participant);
        break;
      case 'addParticipants':
        this.state.items.push(...args.participants);
        break;
      case 'deleteFakes':
        this.state.items = this.state.items.filter((p) => !p.isTest);
        break;
      default:
        console.log('[ParticipantsStorage] unexpected action', args);
    }
    this.state.items.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
    return this.state;
  }
}
