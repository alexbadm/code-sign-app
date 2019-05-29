import React, { FC } from 'react';
import { AppParticipant, AppTeamsTeam } from 'electron';
import './ParticipantsTable.css';

const today = new Date();

export const ParticipantsTable: FC<{ items: AppParticipant[]; teams?: AppTeamsTeam[] }> = ({
  items,
  teams,
}) => {
  const teamsIndex = (teams || []).reduce<{ [k: number]: AppTeamsTeam }>(
    (acc: { [k: number]: AppTeamsTeam }, current: AppTeamsTeam) => {
      acc[current.id] = current;
      return acc;
    },
    {},
  );
  return (
    <table className="ParticipantsTable bordered" cellSpacing="0">
      <thead>
        <tr>
          <td title="Фамилия и имя">Ф.И.</td>
          <td>команда</td>
          <td>дата рожд.</td>
          <td>кол-во лет</td>
          <td>нас.пункт</td>
          <td title="Участвовал ли в КЗ ранее">ветеран</td>
          <td>рост, см</td>
          <td>вес, кг</td>
          <td title="Индекс массы тела">ИМТ</td>
          <td>родитель</td>
        </tr>
      </thead>
      <tbody>
        {items.map((p, idx) => {
          const yrs = Math.round((today.valueOf() - p.birthDate) / 3153600000);
          return (
            <tr key={idx}>
              <td>{p.name}</td>
              <td>
                {p.team === null
                  ? '<не распределен>'
                  : p.team in teamsIndex
                  ? teamsIndex[p.team].name
                  : ''}
              </td>
              <td>{new Date(p.birthDate).toLocaleDateString('ru')}</td>
              <td className="years">
                <span className="int">{(yrs / 10) | 0}</span>
                <span className="tenth">{yrs % 10}</span>
              </td>
              <td>{p.city}</td>
              <td>{p.veteran ? 'да' : 'нет'}</td>
              <td>{p.height}</td>
              <td>{p.weight}</td>
              <td>{p.bmi}</td>
              <td>{p.parent}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
