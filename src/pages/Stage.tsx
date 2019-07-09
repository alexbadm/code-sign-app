import { AppStageConfig, AppStageResults, AppTeamsState } from 'electron';
import React, { Component } from 'react';
import { Button } from 'react-desktop/windows';
import './Stage.css';
const { ipcRenderer } = window.require('electron');

const updateStageResults = (stageId: number, results: AppStageResults[]) =>
  ipcRenderer.send('stages', { type: 'updateStageResults', stageId, results });

interface ITeamStageResult {
  equation: string;
  hasResult: boolean;
  result: number;
}

const teamStageResult = (res: AppStageResults, conf: AppStageConfig): ITeamStageResult => {
  if (!res.teamSize || !res.resultSeconds) {
    return {
      equation: '',
      hasResult: false,
      result: 0,
    };
  }
  const resultSeconds = res.resultSeconds || 0;
  const penaltyPoints = (res.penaltyPoints || 0) * conf.penaltyPoint;
  const penalty = conf.ranking === 'THE_LESS_THE_BETTER' ? penaltyPoints : -penaltyPoints;
  const equationSign = conf.ranking === 'THE_LESS_THE_BETTER' ? '+' : '-';
  return conf.doCountParticipants
    ? {
        equation: `(${resultSeconds} ${equationSign} ${Math.abs(penalty)}) / ${res.teamSize}`,
        hasResult: true,
        result: Math.round((resultSeconds + penalty) / res.teamSize),
      }
    : {
        equation: `${resultSeconds} ${equationSign} ${Math.abs(penalty)}`,
        hasResult: true,
        result: resultSeconds + penalty,
      };
};

interface IStageProps {
  goBack: () => void;
  results: AppStageResults[] | undefined;
  stage: AppStageConfig;
  teams: AppTeamsState;
}

interface IStageState {
  results: AppStageResults[];
}

export class Stage extends Component<IStageProps, IStageState> {
  constructor(props: IStageProps) {
    super(props);
    const results: AppStageResults[] = props.teams.teams
      .map(
        (t) =>
          (props.results || []).find((r) => r.teamId === t.id) || {
            penaltyPoints: undefined,
            resultSeconds: undefined,
            teamId: t.id,
            teamSize: 0,
          },
      )
      .sort((a, b) => a.teamId - b.teamId);
    this.state = { results };
  }

  public render() {
    const { stage } = this.props;
    const teamsNames: { [teamId: number]: string | null } = this.props.teams.teams.reduce(
      (acc: { [teamId: number]: string | null }, team) => {
        acc[team.id] = team.name || `<unnamed #${team.id}>`;
        return acc;
      },
      {},
    );
    return (
      <div className="Stage">
        <h1>
          {stage.name || `<unnamed #${stage.id}>`},{' '}
          {stage.responsible || '<ответственный не указан>'}
        </h1>
        <table className="bordered" cellSpacing="0">
          <thead>
            <tr>
              <th>Команда</th>
              <th title="Количество человек в команде на момент состязания">Кол-во человек</th>
              <th>Результат</th>
              <th>Штрафные баллы</th>
              <th>Итоговый результат</th>
              <th>Место</th>
            </tr>
          </thead>
          <tbody>
            {this.state.results.map((r, idx) => {
              const res = teamStageResult(r, stage);
              return (
                <tr key={idx}>
                  <td>{teamsNames[r.teamId]}</td>
                  <td
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    children={r.teamSize}
                    onKeyDown={(e) => {
                      switch (e.keyCode) {
                        case 13:
                          e.preventDefault();
                          break;
                        case 27:
                          e.currentTarget.innerText = String(r.teamSize);
                          break;
                      }
                    }}
                    onBlur={(e) => {
                      const value = Number(e.target.innerText);
                      if (!isNaN(value) && value !== r.teamSize) {
                        this.updateItem({ ...r, teamSize: value });
                      } else {
                        e.currentTarget.innerText = String(r.teamSize);
                      }
                    }}
                  />
                  <td
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    children={r.resultSeconds}
                    onKeyDown={(e) => {
                      switch (e.keyCode) {
                        case 13:
                          e.preventDefault();
                          break;
                        case 27:
                          e.currentTarget.innerText = String(r.resultSeconds);
                          break;
                      }
                    }}
                    onBlur={(e) => {
                      const value = Number(e.target.innerText);
                      if (!isNaN(value) && value !== r.resultSeconds) {
                        this.updateItem({ ...r, resultSeconds: value });
                      } else {
                        e.currentTarget.innerText = String(r.resultSeconds);
                      }
                    }}
                  />
                  <td
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    children={r.penaltyPoints}
                    onKeyDown={(e) => {
                      switch (e.keyCode) {
                        case 13:
                          e.preventDefault();
                          break;
                        case 27:
                          e.currentTarget.innerText = String(r.penaltyPoints);
                          break;
                      }
                    }}
                    onBlur={(e) => {
                      const value = Number(e.target.innerText);
                      if (!isNaN(value) && value !== r.penaltyPoints) {
                        this.updateItem({ ...r, penaltyPoints: value });
                      } else {
                        e.currentTarget.innerText = String(r.penaltyPoints);
                      }
                    }}
                  />
                  <td title={res.equation}>{res.hasResult ? res.result : ''}</td>
                  <td>FUNC</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p>
          * {stage.ranking === 'THE_LESS_THE_BETTER' ? 'меньше' : 'больше'}-лучше, количество
          участников{stage.doCountParticipants ? ' ' : ' не '}учитывается
        </p>
        <Button onClick={this.props.goBack} children="Назад" />
      </div>
    );
  }

  private updateItem(result: AppStageResults): void {
    const results = this.state.results
      .filter((r) => r.teamId !== result.teamId)
      .concat(result)
      .sort((a, b) => a.teamId - b.teamId);
    this.setState({ ...this.state, results });
    updateStageResults(this.props.stage.id, results);
  }
}
