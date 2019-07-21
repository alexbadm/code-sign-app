declare namespace NodeJS {
  interface Global {
    birthday: Electron.AppBirthdayState;
    participants: Electron.AppParticipantsState;
    stages: Electron.AppStagesState;
    teams: Electron.AppTeamsState;

    databasePath: string;
    NODE_ENV: string;
  }
}

declare namespace Electron {
  interface Remote extends MainInterface {
    getGlobal(name: 'birthday'): AppBirthdayState;
    getGlobal(name: 'participants'): AppParticipantsState;
    getGlobal(name: 'stages'): AppStagesState;
    getGlobal(name: 'teams'): AppTeamsState;

    getGlobal(name: 'databasePath'): string;
    getGlobal(name: 'NODE_ENV'): string;
  }

  interface IpcRenderer extends EventEmitter {
    on(channel: 'birthday', listener: (e: any, state: AppBirthdayState) => void): this;
    send(channel: 'birthday', action: AppBirthdayAction): void;

    on(channel: 'participants', listener: (e: any, state: AppParticipantsState) => void): this;
    send(channel: 'participants', action: AppParticipantsAction): void;

    on(channel: 'stages', listener: (e: any, state: AppStagesState) => void): this;
    send(channel: 'stages', action: AppStagesAction): void;

    on(channel: 'teams', listener: (e: any, state: AppTeamsState) => void): this;
    send(channel: 'teams', action: AppTeamsAction): void;
  }

  interface WebContents extends EventEmitter {
    on(
      event: 'ipc-message',
      listener: (event: Event, channel: AppChannel, action: AppAction) => void,
    ): this;
    once(
      event: 'ipc-message',
      listener: (event: Event, channel: AppChannel, action: AppAction) => void,
    ): this;
    send(channel: AppChannel, state: AppStorageState): void;
  }

  type AppChannel = 'birthday' | 'participants' | 'stages' | 'teams';
  type AppAction = AppBirthdayAction | AppParticipantsAction | AppStagesAction | AppTeamsAction;
  type AppStorageState = AppBirthdayState | AppParticipantsState | AppStagesState | AppTeamsState;

  interface AppDayMonth {
    day: number;
    month: number;
  }

  interface AppBirthdayState {
    fromDate: AppDayMonth;
    toDate: AppDayMonth;
  }

  interface AppBirthdayAction {
    type: 'fromDate' | 'toDate';
    newDate: AppDayMonth;
  }

  interface AppParticipantsState {
    items: AppParticipant[];
  }

  interface AppParticipant {
    name: string;
    team: number | null;
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
        type: 'editParticipant';
        name: string;
        participant: AppParticipant;
      }
    | {
        type: 'deleteParticipant';
        name: string;
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
    name: string | null;
  }

  interface AppTeamsState {
    config: AppTeamsConfig;
    lastAppliedConfig: AppTeamsConfig;
    isSealed: boolean;
    teams: AppTeamsTeam[];
  }

  type AppTeamsAction =
    | { type: 'appoint' }
    | { type: 'seal' }
    | {
        type: 'config';
        newConfig: AppTeamsConfig;
      }
    | {
        type: 'renameTeam';
        teamId: number;
        newName: string;
      };

  interface AppStagesState {
    penaltyPoint: number;
    stages: AppStageConfig[];
    stageResults: { [stageId: number]: AppStageResults[] };
  }

  type AppStageRanking = 'THE_MORE_THE_BETTER' | 'THE_LESS_THE_BETTER';

  interface AppStageConfig {
    id: number;
    name: string;
    penaltyPoint: number;
    responsible: string;
    ranking: AppStageRanking;
    doCountParticipants: boolean;
  }

  interface AppStageResults {
    teamId: number;
    teamSize: number | undefined;
    penaltyPoints: number | undefined;
    resultSeconds: number | undefined;
  }

  type AppStagesAction =
    | {
        type: 'setPenaltyPoint';
        penaltyPoint: number;
      }
    | {
        type: 'setStagesCount';
        count: number;
      }
    | {
        type: 'updateStageConfig';
        stage: AppStageConfig;
      }
    | {
        type: 'updateStageResults';
        stageId: number;
        results: AppStageResults[];
      }
    | {
        type: 'resetAllStagesResults';
      };
}
