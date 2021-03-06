import { AppParticipant, AppTeamsTeam } from 'electron';
import React, { Component } from 'react';
import { ParticipantsTable } from '../components/ParticipantsTable';
import './Team.css';
const { ipcRenderer } = window.require('electron');

const setTeamName = (teamId: number, newName: string) =>
  ipcRenderer.send('teams', {
    newName,
    teamId,
    type: 'renameTeam',
  });

interface ITeamProps {
  isSealed: boolean;
  team: AppTeamsTeam;
  participants: AppParticipant[];
  showModal?: (p: AppParticipant) => void;
}

interface ITeamState {
  nameChanged: boolean;
}

export class Team extends Component<ITeamProps, ITeamState> {
  private nameTextRef: React.RefObject<HTMLSpanElement>;

  constructor(props: ITeamProps) {
    super(props);
    this.state = {
      nameChanged: false,
    };
    this.nameTextRef = React.createRef();
  }

  public render() {
    const { isSealed, team, participants, showModal } = this.props;
    const defaultText = team.name === null ? `<unnamed #${team.id}>` : team.name;
    return (
      <div className="Team">
        <h2>
          <span
            ref={this.nameTextRef}
            contentEditable={!isSealed}
            suppressContentEditableWarning={true}
            children={defaultText}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                e.preventDefault();
                const el = e.target as HTMLSpanElement;
                if (el && el.innerText !== team.name && el.innerText) {
                  setTeamName(this.props.team.id, el.innerText);
                  this.setState({ ...this.state, nameChanged: false });
                }
              }
            }}
            onInput={() => {
              const headerEl = this.nameTextRef.current;
              if (headerEl && headerEl.innerText !== team.name && !this.state.nameChanged) {
                this.setState({ ...this.state, nameChanged: true });
              }
            }}
          />
          {this.state.nameChanged ? (
            <span>
              &nbsp;
              <span
                aria-label="ok"
                role="img"
                onClick={() => {
                  const headerEl = this.nameTextRef.current;
                  if (headerEl && headerEl.innerText !== team.name && headerEl.innerText) {
                    setTeamName(this.props.team.id, headerEl.innerText);
                    this.setState({ ...this.state, nameChanged: false });
                  }
                }}
              >
                ✔️
              </span>
              &nbsp;
              <span
                aria-label="cancel"
                role="img"
                onClick={() => {
                  this.setState({ ...this.state, nameChanged: false });
                  const headerEl = this.nameTextRef.current;
                  if (headerEl) {
                    headerEl.innerText = defaultText;
                  }
                }}
              >
                ✖️
              </span>
            </span>
          ) : null}
        </h2>
        <div className="helper-text">Количество участников: {participants.length}</div>
        <ParticipantsTable
          items={participants}
          filename={`команда-${team.id}-${team.name || 'без-названия'}`}
          editParticipant={showModal}
        />
      </div>
    );
  }
}
