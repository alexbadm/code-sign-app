import React, { FC } from 'react';
import { AppTeamsState, AppTeamsConfig, AppParticipant } from 'electron';
import { Team } from './Team';
import './Teams.css';
const { ipcRenderer } = window.require('electron');

const appoint = () => ipcRenderer.send('teams', { type: 'appoint' });
const seal = () => ipcRenderer.send('teams', { type: 'seal' });
const updateConfig = (newConfig: AppTeamsConfig) =>
  ipcRenderer.send('teams', {
    type: 'config',
    newConfig,
  });

export const Teams: FC<{ state: AppTeamsState; participants: AppParticipant[] }> = ({
  state,
  participants,
}) => (
  <div className="Teams">
    <div className="config">
      <div>
        <input
          name="algorithm"
          type="radio"
          value="teamSize"
          checked={state.config.algorithm === 'teamSize'}
          onClick={() => updateConfig({ ...state.config, algorithm: 'teamSize' })}
          readOnly
        />
        <label>Размер команды</label>
        <input
          type="number"
          step="1"
          min="0"
          disabled={state.config.algorithm !== 'teamSize'}
          value={state.config.teamSize}
          onChange={(e) => updateConfig({ ...state.config, teamSize: Number(e.target.value) })}
        />
      </div>
      <div>
        <input
          name="algorithm"
          type="radio"
          value="teamsCount"
          checked={state.config.algorithm === 'teamsCount'}
          onClick={() => updateConfig({ ...state.config, algorithm: 'teamsCount' })}
          readOnly
        />
        <label>Количество команд</label>
        <input
          type="number"
          step="1"
          min="0"
          disabled={state.config.algorithm !== 'teamsCount'}
          value={state.config.teamsCount}
          onChange={(e) => updateConfig({ ...state.config, teamsCount: Number(e.target.value) })}
        />
      </div>
      <button onClick={appoint}>Распределить</button>
      <button
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
      >
        Зафиксировать распределение
      </button>
    </div>
    {state.teams.map((team, idx) => (
      <Team key={idx} team={team} isSealed={state.isSealed} allParticipants={participants} />
    ))}
  </div>
);
