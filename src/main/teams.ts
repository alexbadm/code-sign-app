import { AppTeamsAction, AppTeamsState } from 'electron';
import { Storage } from './storage';

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

  public ipcMessage(action: AppTeamsAction): AppTeamsState {
    console.log('[TeamsStorage] ipcMessage event', action);
    switch (action.type) {
      case 'appoint':
        this.appoint();
        break;
      case 'seal':
        this.state.isSealed = true;
        break;
      case 'config':
        this.state.config = { ...this.state.config, ...action.newConfig };
        break;
      case 'renameTeam': {
        const team = this.state.teams.find((t) => t.id === action.teamId);
        if (team) {
          team.name = action.newName;
        }
        break;
      }
      default:
        console.log('[TeamsStorage] unexpected action', action);
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
      Storage.sendState('participants');
    }
  }
}
