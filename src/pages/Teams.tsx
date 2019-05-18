import React, { FC } from 'react';
import { AppTeamsState, AppTeamsConfig, AppParticipant } from 'electron';
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
      <button onClick={seal}>Зафиксировать распределение</button>
    </div>
    {state.teams.map((team, idx) => (
      <div key={idx} className="team">
        <h2 title={`id#${team.id}`}>
          {team.name === null ? '<название команды не установлено>' : team.name}
        </h2>
        Участники:
        <ol>
          {participants
            .filter((p) => p.team === team.id)
            .map((p, idx) => (
              <li key={idx}>{p.name}</li>
            ))}
        </ol>
      </div>
    ))}
  </div>
);
