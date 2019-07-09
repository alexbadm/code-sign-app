import { AppStagesState, AppTeamsState } from 'electron';
import React, { FC } from 'react';
import './Results.css';
import { makePlaces, teamStageResult } from './Stage';

interface IResultsProps {
  stages: AppStagesState;
  teams: AppTeamsState;
}

export const Results: FC<IResultsProps> = (props: IResultsProps) => {
  const { stages, stageResults } = props.stages;
  const { teams } = props.teams;

  const stagePlaces = stages.map((s) => {
    const results = (stageResults[s.id] || []).map((r) => teamStageResult(r, s));
    const places = makePlaces(results, s.ranking);
    return {
      name: s.name || `<unnamed #${s.id}>`,
      places: results.reduce<Record<number, number>>((acc, r) => {
        acc[r.teamId] = (!r.hasResult ? places.length : places.indexOf(r.result)) + 1;
        return acc;
      }, {}),
    };
  });

  const totalPlacesSum = teams.reduce<Record<number, number[]>>((acc, team) => {
    const placesSum = stagePlaces.reduce<number>((sum, { places }) => sum + places[team.id], 0);
    if (isNaN(placesSum)) {
      return acc;
    }
    if (!acc[placesSum]) {
      acc[placesSum] = [];
    }
    acc[placesSum].push(team.id);
    return acc;
  }, {});

  const byPlace = Object.entries(totalPlacesSum)
    .sort((a, b) => +a[0] - +b[0])
    .map(([_, teamIds], i) => ({ place: i + 1, teamIds }));

  const teamsPlaces = byPlace.reduce<Record<number, number>>((acc, { place, teamIds }) => {
    teamIds.forEach((id) => (acc[id] = place));
    return acc;
  }, {});

  return (
    <div className="Results">
      <h1>Общая таблица результатов</h1>
      <table className="bordered" cellSpacing="0">
        <thead>
          <tr>
            <th className="diagonal">
              <div>Команда</div>
              <div>Этап</div>
            </th>
            {teams.map((t, idx) => (
              <td key={idx}>{t.name || `<unnamed #${t.id}>`}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {stagePlaces.map((s, idx) => (
            <tr key={idx}>
              <td>{s.name}</td>
              {teams.map((t, i) => (
                <td key={i} data-place={s.places[t.id]} />
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Итого</th>
            {teams.map((team, i) => {
              return <td key={i} data-place={teamsPlaces[team.id]} />;
            })}
          </tr>
        </tfoot>
      </table>

      <h2>Итоговое</h2>
      {byPlace
        .filter((v) => v.place < 4)
        .sort((a, b) => a.place - b.place)
        .map(({ place, teamIds }, idx) => {
          return (
            <div key={idx} className="finalPlace">
              <h3>{place} место</h3>
              <ul>
                {teamIds.map((tid, i) => {
                  return (
                    <li key={i}>
                      {(teams.find((t) => t.id === tid) || { name: undefined }).name ||
                        `<unnamed #${tid}>`}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
    </div>
  );
};
