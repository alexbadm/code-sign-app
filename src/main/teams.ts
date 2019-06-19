import { AppParticipant, AppTeamsAction, AppTeamsState, AppTeamsTeam } from 'electron';
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
    if (!this.state.lastAppliedConfig) {
      this.state.lastAppliedConfig = {
        algorithm: 'teamSize',
        teamSize: 1000,
        teamsCount: 1000,
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
        if (!this.state.isSealed) {
          this.appoint();
          this.state.lastAppliedConfig = this.state.config;
        }
        break;
      case 'seal':
        this.state.isSealed = true;
        break;
      case 'config':
        if (!this.state.isSealed) {
          this.state.config = { ...this.state.config, ...action.newConfig };
        }
        break;
      case 'renameTeam': {
        if (!this.state.isSealed) {
          const team = this.state.teams.find((t) => t.id === action.teamId);
          if (team) {
            team.name = action.newName;
          }
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
        this.state.teams = distribute(participants.items, teamsCount);
      } else {
        const teamsCount = this.state.config.teamsCount;
        this.state.teams = distribute(participants.items, teamsCount);
      }
      Storage.sendState('participants');
    }
  }
}

function distribute(participants: AppParticipant[], teamsCount: number): AppTeamsTeam[] {
  participants.forEach((participant, idx) => (participant.team = idx % teamsCount));
  return new Array(teamsCount).fill(null).map((_, id) => ({ id, name: null }));
}
