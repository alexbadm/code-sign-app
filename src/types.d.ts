interface Window {
  require: (a: 'electron') => typeof import('electron');
}

declare module 'react-desktop';

declare module 'react-desktop/windows' {
  export { Button, NavPane, NavPaneItem, Text, TitleBar, Window };
  const Button: any;
  const NavPaneItem: any;
  const NavPane: any;
  const Text: any;
  const TitleBar: any;
  const Window: any;
}
