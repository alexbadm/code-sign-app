import { AppStageConfig, AppStagesState, AppTeamsState } from 'electron';
import React, { Component, FC } from 'react';
import { Button } from 'react-desktop/windows';
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

export const Stages: FC<IStagesProps> = (props) => {
  const { penaltyPoint, stages } = props.stages;
  return (
    <div className="Stages">
      <h1>Этапы состязаний</h1>
      <div className="config">
        <StagesCountForm count={stages.length} change={setStagesCount} />
        <StagesPenaltyForm penalty={penaltyPoint} change={setPenaltyPoint} />
      </div>
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
          </tr>
        </thead>
        <tbody>
          {stages.map((s, idx) => {
            return (
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
                      updateStageConfig({ ...s, ranking: e.target.value as 'THE_MORE_THE_BETTER' })
                    }
                  >
                    <option value="THE_MORE_THE_BETTER" children="больше-лучше" />
                    <option value="THE_LESS_THE_BETTER" children="меньше-лучше" />
                  </select>
                </td>
                <td
                  className={`bool ${s.doCountParticipants ? 'checked' : ''}`}
                  onClick={() =>
                    updateStageConfig({ ...s, doCountParticipants: !s.doCountParticipants })
                  }
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface IStagesCountFormProps {
  count: number;
  change: (c: number) => void;
}

interface IStagesCountFormState {
  count: number;
}

class StagesCountForm extends Component<IStagesCountFormProps, IStagesCountFormState> {
  constructor(props: IStagesCountFormProps) {
    super(props);
    this.state = {
      count: props.count,
    };
  }

  public render() {
    return (
      <div className="StagesCountForm">
        <label>
          Количество этапов
          <br />
          <input
            type="number"
            step="1"
            min="0"
            value={this.state.count}
            onChange={(e) => this.setState({ count: Number(e.target.value) })}
          />
        </label>
        <br />
        <Button
          children="Применить"
          onClick={() => {
            if (isNaN(this.state.count)) {
              alert('Введено некорректное значение. Ожидается число');
              return;
            }
            if (this.state.count === this.props.count) {
              return;
            }
            if (
              this.state.count > this.props.count ||
              window.confirm(
                `Уменьшение количества этапов приведет удалению последних ${this.props.count -
                  this.state.count} из списка`,
              )
            ) {
              this.props.change(this.state.count);
            }
          }}
        />
      </div>
    );
  }
}

interface IStagesPenaltyFormProps {
  penalty: number;
  change: (p: number) => void;
}

interface IStagesPenaltyFormState {
  penalty: number;
}

// tslint:disable-next-line: max-classes-per-file
class StagesPenaltyForm extends Component<IStagesPenaltyFormProps, IStagesPenaltyFormState> {
  constructor(props: IStagesPenaltyFormProps) {
    super(props);
    this.state = {
      penalty: props.penalty,
    };
  }

  public render() {
    return (
      <div className="StagesPenaltyForm">
        <label>
          Штрафной балл
          <br />
          <input
            type="number"
            step="1"
            min="0"
            value={this.state.penalty}
            onChange={(e) => this.setState({ penalty: Number(e.target.value) })}
          />{' '}
          секунд
        </label>
        <br />
        <Button children="Применить" onClick={() => this.props.change(this.state.penalty)} />
      </div>
    );
  }
}
