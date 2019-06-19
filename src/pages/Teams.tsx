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

export const Teams: FC<ITeamsProps> = ({ state, participants, showModal }) => (
  <div className={`Teams ${state.isSealed ? 'sealed' : 'editable'}`}>
    <div className="config">
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
              state.isSealed || updateConfig({ ...state.config, teamSize: Number(e.target.value) })
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
            // color="#E0E0E0"
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
            children="Зафиксировать распределение"
            // style={{ marginBottom: 16 }}
          />
        </div>
      )}
    </div>
    <div className="summary">
      <div className="amount">Всего команд: {state.teams.length}</div>
      Распределение участников по командам
      <div className="distribution">
        {Object.entries(
          participants.reduce((acc: { [k: string]: number }, p: AppParticipant) => {
            if (p.team !== null) {
              acc[p.team] = 1 + (acc[p.team] || 0);
            }
            return acc;
          }, {}),
        ).map((k, idx) => (
          <div key={idx}>
            {k[0]}: {k[1]}
          </div>
        ))}
      </div>
    </div>
    {state.teams.map((team, idx) => (
      <Team
        key={idx}
        team={team}
        isSealed={state.isSealed}
        allParticipants={participants}
        showModal={showModal}
      />
    ))}
  </div>
);
