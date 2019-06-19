import { AppParticipant, AppTeamsConfig, AppTeamsState } from 'electron';
import React, { FC } from 'react';
import { Button } from 'react-desktop/windows';
import { Team } from './Team';
import './Teams.css';
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
  const teammates = state.teams.map((team) => ({
    participants: participants.filter((p) => p.team === team.id),
    team,
  }));
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
                } else {
                  if (
                    window.confirm(
                      'После выполнения фиксации некоторые операции станут недоступны.' +
                        ' Данное действие необратимо.' +
                        ' Пожалуйста, убедитесь что все участники верно распределены по командам' +
                        ' и названия команд утверждены и больше не будут меняться.',
                    )
                  ) {
                    seal();
                  }
                }
              }}
            />
          </div>
        )}
      </div>
      <div className="summary">
        <h3>Сводка по командам</h3>
        <table className="bordered" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>команда</th>
              <th>кол-во уч.</th>
              <th>средний рост</th>
              <th>средний вес</th>
              <th>средний возраст</th>
              <th>уникальных городов</th>
              <th>доля ветеранов</th>
            </tr>
          </thead>
          <tbody>
            {teammates.map(({ team, participants }, idx) => (
              <tr key={idx}>
                <td>{team.id}</td>
                <td>{team.name}</td>
                <td>{participants.length}</td>
                <td>
                  {Math.round(
                    participants.reduce((sum, p) => sum + p.height, 0) / participants.length,
                  )}
                </td>
                <td>
                  {Math.round(
                    participants.reduce((sum, p) => sum + p.weight, 0) / participants.length,
                  )}
                </td>
                <td>
                  {Math.round(
                    (Date.now() -
                      participants.reduce((sum, p) => sum + p.birthDate, 0) / participants.length) /
                      1000 /
                      60 /
                      60 /
                      24 /
                      365,
                  )}
                </td>
                <td>
                  {Math.round(
                    (participants.reduce(
                      (cities: string[], p) =>
                        !~cities.indexOf(p.city) ? [...cities, p.city] : cities,
                      [],
                    ).length /
                      participants.length) *
                      100,
                  )}
                  %
                </td>
                <td>
                  {Math.round(
                    (participants.reduce((sum: number, p) => sum + (p.veteran ? 1 : 0), 0) /
                      participants.length) *
                      100,
                  )}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
