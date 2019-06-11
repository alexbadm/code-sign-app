import React, { Component } from 'react';
import { AppTeamsTeam, AppParticipant } from 'electron';
import { ParticipantsTable } from '../components/ParticipantsTable';
const { ipcRenderer } = window.require('electron');

const setTeamName = (teamId: number, newName: string) =>
  ipcRenderer.send('teams', {
    type: 'renameTeam',
    teamId,
    newName,
  });

interface ITeamProps {
  isSealed: boolean;
  team: AppTeamsTeam;
  allParticipants: AppParticipant[];
}

interface ITeamState {
  editingName: string;
  isEditing: boolean;
}

export class Team extends Component<ITeamProps, ITeamState> {
  constructor(props: ITeamProps) {
    super(props);
    this.state = {
      editingName: props.team.name || '',
      isEditing: false,
    };
  }

  render() {
    const { isSealed, team, allParticipants } = this.props;
    return (
      <div className="Team">
        {this.state.isEditing ? (
          <div>
            <input
              type="text"
              value={this.state.editingName}
              onChange={(e) =>
                this.setState({
                  ...this.state,
                  editingName: e.target.value,
                })
              }
            />
            <button
              onClick={() => {
                setTeamName(this.props.team.id, this.state.editingName);
                this.setState({ ...this.state, isEditing: false });
              }}
            >
              Сохранить
            </button>
            <button onClick={() => this.setState({ ...this.state, isEditing: false })}>
              Отменить
            </button>
          </div>
        ) : (
          <h2 title={`id#${team.id}`}>
            {team.name === null ? '<unnamed> #' + team.id : team.name}
            {isSealed ? null : (
              <button onClick={() => this.setState({ ...this.state, isEditing: true })}>
                Править
              </button>
            )}
          </h2>
        )}
        <ParticipantsTable items={allParticipants.filter((p) => p.team === team.id)} />
      </div>
    );
  }
}
