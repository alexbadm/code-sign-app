import { AppParticipant, AppTeamsTeam } from 'electron';
import React, { FC } from 'react';
import { Average } from '../components/Average';

export interface ITeamComposition {
  participants: AppParticipant[];
  team: AppTeamsTeam;
}

export const TeamsSummary: FC<{ teammates: ITeamComposition[] }> = ({ teammates }) => (
  <div className="TeamsSummary">
    <h3>Сводка по командам</h3>
    <table className="bordered" cellSpacing="0">
      <thead>
        <tr>
          <th>#</th>
          <th>команда</th>
          <th>кол-во уч.</th>
          <th>рост</th>
          <th>вес</th>
          <th>ИМТ</th>
          <th>возраст</th>
          <th>уникальных городов</th>
          <th>доля ветеранов</th>
        </tr>
      </thead>
      <tbody>
        {teammates
          .filter((t) => !(t.team.id === -1 && t.participants.length === 0))
          .map(({ team, participants }, idx) =>
            participants.length === 0 ? (
              <tr key={idx}>
                <td>{team.id}</td>
                <td>{team.name}</td>
                <td>{participants.length}</td>
                <td>---</td>
                <td>---</td>
                <td>---</td>
                <td>---</td>
                <td>---</td>
                <td>---</td>
              </tr>
            ) : (
              <tr key={idx}>
                <td>{team.id}</td>
                <td>{team.name}</td>
                <td>{participants.length}</td>
                <td>
                  <Average
                    avg={Math.round(
                      participants.reduce((sum, p) => sum + p.height, 0) / participants.length,
                    )}
                    max={participants.reduce((max, p) => Math.max(max, p.height), 0)}
                    min={participants.reduce((min, p) => Math.min(min, p.height), 999)}
                  />
                </td>
                <td>
                  <Average
                    avg={Math.round(
                      participants.reduce((sum, p) => sum + p.weight, 0) / participants.length,
                    )}
                    max={participants.reduce((max, p) => Math.max(max, p.weight), 0)}
                    min={participants.reduce((min, p) => Math.min(min, p.weight), 999)}
                  />
                </td>
                <td>
                  <Average
                    avg={Math.round(
                      participants.reduce((sum, p) => sum + p.bmi, 0) / participants.length,
                    )}
                    max={participants.reduce((max, p) => Math.max(max, p.bmi), 0)}
                    min={participants.reduce((min, p) => Math.min(min, p.bmi), 999)}
                  />
                </td>
                <td>
                  <Average
                    avg={Math.round(
                      (Date.now() -
                        participants.reduce((sum, p) => sum + p.birthDate, 0) /
                          participants.length) /
                        31536000000,
                    )}
                    max={Math.round(
                      (Date.now() -
                        participants.reduce((min, p) => Math.min(min, p.birthDate), Date.now())) /
                        31536000000,
                    )}
                    min={Math.round(
                      (Date.now() -
                        participants.reduce((max, p) => Math.max(max, p.birthDate), 0)) /
                        31536000000,
                    )}
                  />
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
            ),
          )}
      </tbody>
    </table>
  </div>
);
