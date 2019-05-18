import { Storage } from './storage';
import { AppTeamsState, AppTeamsAction } from 'electron';

export class TeamsStorage extends Storage {
  protected state!: AppTeamsState;

  constructor() {
    super('teams');
    global.teams = this.state;
    if (!this.state.config || !this.state.config.algorithm) {
      this.state.config = {
        algorithm: 'teamSize',
        teamSize: 8,
        teamsCount: 15,
      };
    }
    this.state.isSealed = !!this.state.isSealed;
    if (!this.state.teams) {
      this.state.teams = [];
    }
  }

  public ipcMessage(args: AppTeamsAction): AppTeamsState {
    console.log('[TeamsStorage] ipcMessage event', args);
    switch (args.type) {
      case 'appoint':
        this.appoint();
        break;
      case 'seal':
        this.state.isSealed = true;
        break;
      case 'config':
        this.state.config = { ...this.state.config, ...args.newConfig };
        break;
      default:
        console.log('[TeamsStorage] unexpected action', args);
    }
    return this.state;
  }

  private appoint() {
    const participants = global.participants;
    if (participants) {
      const count = participants.items.length;
      if (this.state.config.algorithm === 'teamSize') {
        const teamSize = this.state.config.teamSize;
        const teamsCount = Math.round(count / teamSize);
        participants.items.forEach((participant, idx) => (participant.team = idx % teamsCount));
        this.state.teams = new Array(teamsCount).fill(null).map((_, id) => ({ id, name: null }));
      } else {
        const teamsCount = this.state.config.teamsCount;
        participants.items.forEach((participant, idx) => (participant.team = idx % teamsCount));
        this.state.teams = new Array(teamsCount).fill(null).map((_, id) => ({ id, name: null }));
      }
    }
  }
}
