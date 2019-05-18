import React, { Component } from 'react';
import { Window, Text, NavPane, NavPaneItem } from 'react-desktop/windows';
import './App.css';
import { Participants } from './pages/Participants';
import { Teams } from './pages/Teams';
import { renderIcon } from './icons';
import { SummaryOfCities } from './pages/SummaryOfCities';
import { SummaryOfYears } from './pages/SummaryOfYears';
import { Birthday } from './pages/Birthday';
import { AppBirthdayState, AppTeamsState, AppParticipantsState } from 'electron';

const { remote, ipcRenderer } = window.require('electron');

interface IAppProps {
  color?: string;
  theme?: string;
}

interface IAppState {
  birthday: AppBirthdayState;
  participants: AppParticipantsState;
  selected: string;
  teams: AppTeamsState;
}

class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      birthday: remote.getGlobal('birthday'),
      participants: remote.getGlobal('participants'),
      selected: 'Участники',
      teams: remote.getGlobal('teams'),
    };
    ipcRenderer.on('birthday', (_: any, birthday: AppBirthdayState) => {
      this.setState({ ...this.state, birthday });
    });
    ipcRenderer.on('participants', (_: any, participants: AppParticipantsState) => {
      this.setState({ ...this.state, participants });
    });
    ipcRenderer.on('teams', (_: any, teams: AppTeamsState) => {
      this.setState({ ...this.state, teams });
    });
  }

  render() {
    return (
      <Window background="#eee" chrome color={this.props.color} theme={this.props.theme}>
        <NavPane openLength={200} color={this.props.color} theme={this.props.theme}>
          {this.renderItem('Участники', <Participants items={this.state.participants.items} />)}
          {this.renderItem(
            'Сводка по городу',
            <SummaryOfCities participants={this.state.participants.items} />,
          )}
          {this.renderItem(
            'Сводка по возрасту',
            <SummaryOfYears participants={this.state.participants.items} />,
          )}
          {this.renderItem(
            'Именинники',
            <Birthday
              fromDate={this.state.birthday.fromDate}
              toDate={this.state.birthday.toDate}
              participants={this.state.participants.items}
            />,
          )}
          {this.renderItem(
            'Команды',
            <Teams state={this.state.teams} participants={this.state.participants.items} />,
          )}
          {this.renderItem('Этапы', <Text>Content 3</Text>)}
          {this.renderItem('Результаты', <Text>Content 4</Text>)}

          {this.renderItem('Настройка турнира', <Text>Content 5</Text>)}
          {this.renderItem('Резервное копирование', <Text>Резервное копирование</Text>)}
        </NavPane>
        <div className="floatingFlags">
          {this.state.teams.isSealed ? <div>Распределение зафиксировано</div> : null}
        </div>
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
