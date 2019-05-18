import React, { FC } from 'react';
import { AppParticipant } from 'electron';

interface ISummaryOfCitiesProps {
  participants: AppParticipant[];
}

export const SummaryOfCities: FC<ISummaryOfCitiesProps> = ({ participants }) => (
  <div className="SummaryOfCities">
    <table className="bordered" cellSpacing="0">
      <thead>
        <tr>
          <td>Город</td>
          <td>Количество участников</td>
        </tr>
      </thead>
      <tbody>
        {Object.entries(participants.reduce((acc: { [city: string]: number }, p): {
          [city: string]: number;
        } => {
          if (!(p.city in acc)) {
            acc[p.city] = 0;
          }
          acc[p.city]++;
          return acc;
        }, {}) as { [city: string]: number })
          .sort((a, b) => b[1] - a[1])
          .map(([city, count], idx) => (
            <tr key={idx}>
              <td>{city}</td>
              <td>{count}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);
