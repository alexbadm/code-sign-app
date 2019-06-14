import { AppParticipant, AppTeamsTeam } from 'electron';
import React, { FC } from 'react';
import './ParticipantsTable.css';
const { ipcRenderer } = window.require('electron');

const today = new Date();

interface IParticipantsTableProps {
  items: AppParticipant[];
  teams?: AppTeamsTeam[];
  editParticipant?: (p: AppParticipant) => void;
}

export const ParticipantsTable: FC<IParticipantsTableProps> = ({
  items,
  teams,
  editParticipant,
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
          {teams ? <td>команда</td> : null}
          <td>дата рожд.</td>
          <td>кол-во лет</td>
          <td>нас.пункт</td>
          <td title="Участвовал ли в КЗ ранее">ветеран</td>
          <td>рост, см</td>
          <td>вес, кг</td>
          <td title="Индекс массы тела">ИМТ</td>
          <td>родитель</td>
          {editParticipant ? <td>действия</td> : null}
        </tr>
      </thead>
      <tbody>
        {items.map((p, idx) => {
          const yrs = Math.round((today.valueOf() - p.birthDate) / 3153600000);
          return (
            <tr key={idx}>
              <td>{p.name}</td>
              {teams ? (
                <td>
                  {p.team === null
                    ? '<не распределен>'
                    : p.team in teamsIndex
                    ? teamsIndex[p.team].name || '<unnamed> #' + p.team
                    : ''}
                </td>
              ) : null}
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
              {editParticipant ? (
                <td>
                  <span role="img" onClick={() => editParticipant(p)}>
                    ✏️
                  </span>
                  &nbsp;
                  <span role="img" onClick={() => delConfirm(p)}>
                    ✖️
                  </span>
                </td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

function delConfirm(participant: AppParticipant) {
  if (window.confirm(`Подтверждаете удаление участника ${participant.name}?`)) {
    ipcRenderer.send('participants', { type: 'deleteParticipant', name: participant.name });
  }
}
