import {
  AppBirthdayState,
  AppParticipant,
  AppParticipantsState,
  AppStagesState,
  AppTeamsState,
} from 'electron';
import React, { Component } from 'react';
import { NavPane, NavPaneItem, Text, Window } from 'react-desktop/windows';
import './App.css';
import { Modal } from './components/modal';
import { ParticipantForm } from './components/ParticipantForm';
import { renderIcon } from './icons';
import { Birthday } from './pages/Birthday';
import { Participants } from './pages/Participants';
import { Results } from './pages/Results';
import { Stages } from './pages/Stages';
import { SummaryOfCities } from './pages/SummaryOfCities';
import { SummaryOfYears } from './pages/SummaryOfYears';
import { Teams } from './pages/Teams';
import './table.css';

const { remote, ipcRenderer } = window.require('electron');

interface IAppProps {
  color?: string;
  theme?: string;
}

interface IAppState {
  birthday: AppBirthdayState;
  participants: AppParticipantsState;
  selected: string;
  stages: AppStagesState;
  teams: AppTeamsState;
  isModalShown: boolean;
  modalEditParticipant: AppParticipant | undefined;
}

class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      birthday: remote.getGlobal('birthday'),
      isModalShown: false,
      modalEditParticipant: undefined,
      participants: remote.getGlobal('participants'),
      selected: 'Участники',
      stages: remote.getGlobal('stages'),
      teams: remote.getGlobal('teams'),
    };
    ipcRenderer.on('birthday', (_: any, birthday: AppBirthdayState) => {
      this.setState({ ...this.state, birthday });
    });
    ipcRenderer.on('participants', (_: any, participants: AppParticipantsState) => {
      this.setState({ ...this.state, participants });
    });
    ipcRenderer.on('stages', (_: any, stages: AppStagesState) => {
      this.setState({ ...this.state, stages });
    });
    ipcRenderer.on('teams', (_: any, teams: AppTeamsState) => {
      this.setState({ ...this.state, teams });
    });
  }

  public render() {
    const showModal = (modalEditParticipant?: AppParticipant) => {
      this.setState({ ...this.state, isModalShown: true, modalEditParticipant });
    };
    return (
      <Window background="#eee" chrome={true} color={this.props.color} theme={this.props.theme}>
        <NavPane openLength={200} color={this.props.color} theme={this.props.theme}>
          {this.renderItem(
            'Участники',
            <Participants
              items={this.state.participants.items}
              teams={this.state.teams}
              showModal={showModal}
            />,
          )}
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
            <Teams
              state={this.state.teams}
              participants={this.state.participants.items}
              showModal={showModal}
            />,
          )}
          {this.renderItem('Этапы', <Stages stages={this.state.stages} teams={this.state.teams} />)}
          {this.renderItem(
            'Результаты',
            <Results stages={this.state.stages} teams={this.state.teams} />,
          )}

          {/* {this.renderItem('Настройка турнира', <Text>Content 5</Text>)} */}
          {this.renderItem(
            'Резервное копирование',
            <Text>
              Резервное копирование
              <br />
              Не реализовано
            </Text>,
          )}
        </NavPane>
        <div className="floatingFlags">
          {this.state.teams.isSealed ? <div>Распределение зафиксировано</div> : null}
        </div>
        {this.state.isModalShown ? (
          <Modal
            height={600}
            width={400}
            onBackgroundClick={() => this.setState({ ...this.state, isModalShown: false })}
          >
            <ParticipantForm
              teams={this.state.teams.teams}
              editParticipant={this.state.modalEditParticipant}
              closeModal={() =>
                this.setState({
                  ...this.state,
                  isModalShown: false,
                  modalEditParticipant: undefined,
                })
              }
            />
          </Modal>
        ) : (
          <div />
        )}
      </Window>
    );
  }

  private renderItem(title: string, content: JSX.Element) {
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
