import { AppParticipant } from 'electron';
import React, { FC } from 'react';

interface ISummaryOfYearsProps {
  participants: AppParticipant[];
}

const today = new Date();

export const SummaryOfYears: FC<ISummaryOfYearsProps> = ({ participants }) => (
  <div className="SummaryOfYears">
    <table className="bordered" cellSpacing="0">
      <thead>
        <tr>
          <td>Возраст</td>
          <td>Количество участников</td>
        </tr>
      </thead>
      <tbody>
        {Object.entries(participants.reduce((acc: { [years: string]: number }, p): {
          [years: string]: number;
        } => {
          const years = Math.floor((today.valueOf() - p.birthDate) / 31536000000);
          if (!(years in acc)) {
            acc[years] = 0;
          }
          acc[years]++;
          return acc;
        }, {}) as { [years: string]: number })
          .sort((a, b) => +a[0] - +b[0])
          .map(([years, count], idx) => (
            <tr key={idx}>
              <td>{years}</td>
              <td>{count}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);
