import React, { Component } from 'react';
import { Window, TitleBar, Text, NavPane, NavPaneItem, Button } from 'react-desktop/windows';
import './App.css';
import { Participants } from './pages/Participants';
import { renderIcon } from './icons';
// import { ipcRenderer } from 'electron';

interface IAppProps {
  color?: string;
  theme?: string;
}

class App extends Component<IAppProps, { selected: string }> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      selected: 'Участники'
    }
  }

  render() {
    return (
      <Window
        background="#eee"
        chrome
        color={this.props.color}
        theme={this.props.theme}
      >
        <TitleBar
          title="КЗ База данных турнира"
          background={this.props.color}
          controls
          onCloseClick={() => console.log("window close event")}
          // onCloseClick={() => remote.getCurrentWindow().close()}
          // onCloseClick={() => ipcRenderer.sendSync('app-control', "some arg")}
        />
        <NavPane openLength={200} color={this.props.color} theme={this.props.theme}>
          {this.renderItem('Участники', <Participants />)}
          {this.renderItem('Сводка по городу', <Text>Сводка по городу</Text>)}
          {this.renderItem('Сводка по возрасту', <Text>Сводка по возрасту</Text>)}
          {this.renderItem('Именинники', <Text>Именинники</Text>)}
          {this.renderItem('Команды', <Text>Content 2</Text>)}
          {this.renderItem('Этапы', <Text>Content 3</Text>)}
          {this.renderItem('Результаты', <Text>Content 4</Text>)}
          {this.renderItem('Настройка турнира', <Text>Content 5</Text>)}
          {this.renderItem('Резервное копирование', <Text>Резервное копирование</Text>)}
        </NavPane>
      </Window>
    );
  }

  renderItem(title: string, content: JSX.Element) {
    return (
      <NavPaneItem
        title={title}
        icon={renderIcon(title)}
        theme={this.props.theme}
        background="#ffffff"
        selected={this.state.selected === title}
        onSelect={() => this.setState({ selected: title })}
        padding="10px 20px"
        children={content}
      />
    );
  }
}

export default App;
