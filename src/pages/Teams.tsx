import { AppParticipant, AppTeamsConfig, AppTeamsState, AppTeamsTeam } from 'electron';
import React, { FC } from 'react';
import { Button } from 'react-desktop/windows';
import { Team } from './Team';
import './Teams.css';
import { ITeamComposition, TeamsSummary } from './TeamsSummary';
const { ipcRenderer } = window.require('electron');

const appoint = () => ipcRenderer.send('teams', { type: 'appoint' });
const seal = () => ipcRenderer.send('teams', { type: 'seal' });
const updateConfig = (newConfig: AppTeamsConfig) =>
  ipcRenderer.send('teams', {
    newConfig,
    type: 'config',
  });

interface ITeamsProps {
  state: AppTeamsState;
  participants: AppParticipant[];
  showModal?: (p: AppParticipant) => void;
}

export const Teams: FC<ITeamsProps> = ({ state, participants, showModal }) => {
  const teammates: ITeamComposition[] = state.teams.map((team) => ({
    participants: participants.filter((p) => p.team === team.id),
    team,
  }));
  const unassigned: ITeamComposition = {
    participants: participants.filter((p) => p.team === null),
    team: { id: -1, name: 'Нераспределенные участники' },
  };
  const configHasChanges =
    state.config.algorithm !== state.lastAppliedConfig.algorithm ||
    state.config.teamSize !== state.lastAppliedConfig.teamSize ||
    state.config.teamsCount !== state.lastAppliedConfig.teamsCount;
  return (
    <div className={`Teams ${state.isSealed ? 'sealed' : 'editable'}`}>
      <div className={`config ${configHasChanges ? 'changed' : ''}`}>
        <div className="algo-wrap">
          <div
            className={`algo-type ${state.config.algorithm === 'teamSize' ? 'active' : ''}`}
            onClick={() =>
              !state.isSealed &&
              state.config.algorithm !== 'teamSize' &&
              updateConfig({ ...state.config, algorithm: 'teamSize' })
            }
          >
            <label>Размер команды</label>
            <input
              type="number"
              step="1"
              min="0"
              disabled={state.isSealed || state.config.algorithm !== 'teamSize'}
              value={state.config.teamSize}
              onChange={(e) =>
                state.isSealed ||
                updateConfig({ ...state.config, teamSize: Number(e.target.value) })
              }
            />
          </div>
          <div
            className={`algo-type ${state.config.algorithm === 'teamsCount' ? 'active' : ''}`}
            onClick={() =>
              !state.isSealed &&
              state.config.algorithm !== 'teamsCount' &&
              updateConfig({ ...state.config, algorithm: 'teamsCount' })
            }
          >
            <label>Количество команд</label>
            <input
              type="number"
              step="1"
              min="0"
              disabled={state.isSealed || state.config.algorithm !== 'teamsCount'}
              value={state.config.teamsCount}
              onChange={(e) =>
                state.isSealed ||
                updateConfig({ ...state.config, teamsCount: Number(e.target.value) })
              }
            />
          </div>
        </div>
        {state.isSealed ? (
          <div className="has-sealed">Распределение зафиксировано</div>
        ) : (
          <div className="buttons">
            <Button
              // color="#2D9CDB"
              onClick={appoint}
              children="Распределить"
              style={{ marginRight: 16 }}
            />
            <Button
              children="Зафиксировать распределение"
              onClick={() => {
                if (state.teams.some((t) => t.name === null)) {
                  window.alert('Не все команды имеют название. Нельзя фиксировать');
                } else if (unassigned.participants.length) {
                  window.alert('Не все участники распределены по командам. Нельзя фиксировать');
                } else if (
                  window.confirm(
                    `        После выполнения фиксации станут недоступны некоторые операции, такие как автоматическое распределение и переименование команд.

        Изменение состава команд останется доступным только в ручном режиме.

        Отменить фиксацию нельзя. Пожалуйста, убедитесь что все участники верно распределены по командам и названия команд утверждены и больше не будут меняться.`,
                  )
                ) {
                  seal();
                }
              }}
            />
          </div>
        )}
      </div>
      <TeamsSummary teammates={teammates.concat(unassigned)} />
      {unassigned.participants.length ? (
        <Team
          team={unassigned.team}
          isSealed={true}
          participants={unassigned.participants}
          showModal={showModal}
        />
      ) : null}
      <h1>Команды</h1>
      {teammates.map(({ team, participants }, idx) => (
        <Team
          key={idx}
          team={team}
          isSealed={state.isSealed}
          participants={participants}
          showModal={showModal}
        />
      ))}
    </div>
  );
};
