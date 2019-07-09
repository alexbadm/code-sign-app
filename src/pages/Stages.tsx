import { AppStageConfig, AppStagesState, AppTeamsState } from 'electron';
import React, { Component } from 'react';
import { StagesCountForm } from '../components/StagesCountForm';
import { StagesPenaltyForm } from '../components/StagesPenaltyForm';
import { Stage } from './Stage';
import './Stages.css';
const { ipcRenderer } = window.require('electron');

const setPenaltyPoint = (penaltyPoint: number) =>
  ipcRenderer.send('stages', { type: 'setPenaltyPoint', penaltyPoint });

const setStagesCount = (count: number) =>
  ipcRenderer.send('stages', { type: 'setStagesCount', count });

const updateStageConfig = (stage: AppStageConfig) =>
  ipcRenderer.send('stages', { type: 'updateStageConfig', stage });

interface IStagesProps {
  stages: AppStagesState;
  teams: AppTeamsState;
}

interface IStagesState {
  stagePage: AppStageConfig | undefined;
}

export class Stages extends Component<IStagesProps, IStagesState> {
  constructor(props: IStagesProps) {
    super(props);
    this.state = { stagePage: undefined };
  }

  public render() {
    if (this.state.stagePage !== undefined) {
      return (
        <Stage
          goBack={() => this.setState({ ...this.state, stagePage: undefined })}
          results={this.props.stages.stageResults[this.state.stagePage.id]}
          stage={this.state.stagePage}
          teams={this.props.teams}
        />
      );
    }

    const { penaltyPoint, stages } = this.props.stages;
    return (
      <div className="Stages">
        <h1>Этапы состязаний</h1>
        <div className="config">
          <StagesCountForm count={stages.length} change={setStagesCount} />
          <StagesPenaltyForm penalty={penaltyPoint} change={setPenaltyPoint} />
        </div>
        <h2>Список этапов</h2>
        <table className="bordered" cellSpacing="0">
          <thead>
            <tr>
              <th>№</th>
              <th>Название</th>
              <th>Ответственный</th>
              <th>Система оценок</th>
              <th title="Учитывать ли количество участников при вычислении результата">
                Считать&#8230;
              </th>
              <th>Переход</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  children={s.name}
                  onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
                  onBlur={(e) => {
                    const value = e.target.innerText;
                    if (value && value !== s.name) {
                      updateStageConfig({ ...s, name: value });
                    }
                  }}
                />
                <td
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  children={s.responsible}
                  onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
                  onBlur={(e) => {
                    const value = e.target.innerText;
                    if (value && value !== s.responsible) {
                      updateStageConfig({ ...s, responsible: value });
                    }
                  }}
                />
                <td>
                  <select
                    value={s.ranking}
                    onChange={(e) =>
                      e.target.value !== s.ranking &&
                      updateStageConfig({
                        ...s,
                        ranking: e.target.value as 'THE_MORE_THE_BETTER',
                      })
                    }
                  >
                    <option value="THE_MORE_THE_BETTER" children="больше-лучше" />
                    <option value="THE_LESS_THE_BETTER" children="меньше-лучше" />
                  </select>
                </td>
                <td
                  className={`bool ${s.doCountParticipants ? 'checked' : ''}`}
                  title="Нажмите, чтобы изменить значение"
                  onClick={() =>
                    updateStageConfig({ ...s, doCountParticipants: !s.doCountParticipants })
                  }
                />
                <td
                  className="forward"
                  onClick={() => this.setState({ ...this.state, stagePage: s })}
                >
                  Перейти
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
