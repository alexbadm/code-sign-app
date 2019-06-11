interface Window {
  require: (a: 'electron') => typeof import('electron');
}

declare module 'react-desktop';

declare module 'react-desktop/windows' {
  export { Button, Checkbox, Label, NavPane, NavPaneItem, Text, TextInput, TitleBar, Window };
  const Button: any;
  const Checkbox: any;
  const Label: any;
  const NavPaneItem: any;
  const NavPane: any;
  const Text: any;
  const TextInput: any;
  const TitleBar: any;
  const Window: any;
}
