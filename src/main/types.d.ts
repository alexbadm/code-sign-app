
declare namespace NodeJS {
  interface Global {
    birthday: any;
    participants: any;
    teams: any;
  }
}

declare namespace Electron {
  interface WebContents {
    on(event: 'ipc-message', listener: (event: any, input: any[]) => void): this;
  }
}
