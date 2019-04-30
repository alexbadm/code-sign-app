import React, { Component } from 'react';
import { Window, Text, NavPane, NavPaneItem } from 'react-desktop/windows';
import './App.css';
import { Participants } from './pages/Participants';
import { Teams } from './pages/Teams';
import { renderIcon } from './icons';
import { SummaryOfCities } from './pages/SummaryOfCities';
import { SummaryOfYears } from './pages/SummaryOfYears';
import { Birthday, IBirthdaySource } from './pages/Birthday';
// import { ipcRenderer, remote } from 'electron';
const { remote, ipcRenderer } = window.require('electron');

const participants: any[] = remote.getGlobal('participants');
const teams = remote.getGlobal('teams');

interface IAppProps {
  color?: string;
  theme?: string;
}

interface IAppState {
  birthday: IBirthdaySource;
  selected: string;
}

class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      birthday: remote.getGlobal('birthday'),
      selected: 'Участники',
    };
    ipcRenderer.on("birthday", (_: any, birthday: IBirthdaySource) => {
      this.setState({ ...this.state, birthday });
    });
  }

  render() {
    return (
      <Window background="#eee" chrome color={this.props.color} theme={this.props.theme}>
        <NavPane openLength={200} color={this.props.color} theme={this.props.theme}>
          {this.renderItem('Участники', <Participants participants={participants} />)}
          {this.renderItem('Сводка по городу', <SummaryOfCities participants={participants} />)}
          {this.renderItem('Сводка по возрасту', <SummaryOfYears participants={participants} />)}
          {this.renderItem(
            'Именинники',
            <Birthday
              fromDate={this.state.birthday.fromDate}
              toDate={this.state.birthday.toDate}
              participants={participants}
              onFromDateChange={(ts) => ipcRenderer.send("birthday", "fromDate", ts)}
              onToDateChange={(ts) => ipcRenderer.send("birthday", "toDate", ts)}
            />,
          )}
          {this.renderItem('Команды', <Teams config={teams.config} teams={{}} />)}
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
