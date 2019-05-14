import React, { FC } from 'react';
import './Participants.css';

const columns = [
  {
    Header: 'Ф.И.',
    accessor: 'name',
  },
  {
    Header: 'команда',
    accessor: 'team',
  },
  {
    Header: 'кол-во лет',
    accessor: 'years',
  },
  {
    Header: 'нас.пункт',
    accessor: 'city',
  },
  {
    Header: 'участвовал КЗ ранее',
    accessor: 'veteran',
  },
  {
    Header: 'рост,см',
    accessor: 'height',
  },
  {
    Header: 'вес,кг',
    accessor: 'weight',
  },
  {
    Header: 'ИМТ',
    accessor: 'bmi',
  },
  {
    Header: 'родитель',
    accessor: 'parent',
  },
];

interface IParticipantsProps {
  participants: any[];
}

const today = new Date();

export const Participants: FC<IParticipantsProps> = ({ participants }) => (
  <div className="Participants">
    <table className="bordered" cellSpacing="0">
      <thead>
        <tr>
          {columns.map((c, idx) => (
            <td key={idx}>{c.Header}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {participants.map((p, idx) => (
          <tr key={idx}>
            <td>{p.name}</td>
            <td>{p.team}</td>
            <td>{Math.round((today.valueOf() - p.birthDate) / 3153600000) / 10}</td>
            <td>{p.city}</td>
            <td>{p.veteran ? 'да' : 'нет'}</td>
            <td>{p.height}</td>
            <td>{p.weight}</td>
            <td>{p.bmi}</td>
            <td>{p.parent}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
