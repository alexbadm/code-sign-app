declare namespace NodeJS {
  interface Global {
    birthday: Electron.AppBirthdayState;
    participants: Electron.AppParticipantsState;
    teams: Electron.AppTeamsState;
  }
}

declare namespace Electron {
  interface Remote extends MainInterface {
    getGlobal(name: 'birthday'): AppBirthdayState;
    getGlobal(name: 'participants'): AppParticipantsState;
    getGlobal(name: 'teams'): AppTeamsState;
  }

  interface IpcRenderer extends EventEmitter {
    on(channel: 'birthday', listener: (e: any, state: AppBirthdayState) => void): this;
    send(channel: 'birthday', action: AppBirthdayAction): void;

    on(channel: 'participants', listener: (e: any, state: AppParticipantsState) => void): this;
    send(channel: 'participants', action: AppParticipantsAction): void;

    on(channel: 'teams', listener: (e: any, state: AppTeamsState) => void): this;
    send(channel: 'teams', action: AppTeamsAction): void;
  }

  interface AppBirthdayState {
    fromDate: number;
    toDate: number;
  }

  interface AppBirthdayAction {
    type: 'fromDate' | 'toDate';
    newDate: number;
  }

  interface AppParticipantsState {
    items: AppParticipant[];
  }

  interface AppParticipant {
    name: string;
    team: number | null;
    years: number; // to delete
    birthDate: number;
    city: any;
    veteran: boolean;
    height: number;
    weight: number;
    bmi: number;
    parent: string;
    isTest: boolean;
  }

  type AppParticipantsAction =
    | {
        type: 'addParticipant';
        participant: AppParticipant;
      }
    | {
        type: 'addParticipants';
        participants: AppParticipant[];
      }
    | {
        type: 'deleteFakes';
      };

  interface AppTeamsConfig {
    algorithm: 'teamSize' | 'teamsCount';
    teamSize: number;
    teamsCount: number;
  }

  interface AppTeamsTeam {
    id: number;
    name: string|null;
  }

  interface AppTeamsState {
    config: AppTeamsConfig;
    isSealed: boolean;
    teams: AppTeamsTeam[];
  }

  type AppTeamsAction =
    | { type: 'appoint' }
    | { type: 'seal' }
    | {
        type: 'config';
        newConfig: AppTeamsConfig;
      };
}
