import { Storage } from "./storage";

interface ITeamsConfig {
  algorithm: "teamSize"|"teamsCount";
  teamSize: number;
  teamsCount: number;
}

interface ITeamsState {
  config: ITeamsConfig;
}

export class TeamsStorage extends Storage {
  protected state!: ITeamsState;

  constructor() {
    super("teams");
    global.teams = this.state;
    if (!this.state.config || !this.state.config.algorithm) {
      this.state.config = {
        algorithm: "teamSize",
        teamSize: 8,
        teamsCount: 15,
      };
    }
  }

  public ipcMessage([channel, type, newConfig]: ['teams', 'config', ITeamsConfig]): ITeamsState {
    if (channel === this.channel && type === 'config') {
      this.state.config = newConfig;
      console.log('[TeamsStorage] ipcMessage event', [channel, type, newConfig]);
    }
    return this.state;
  }
}
