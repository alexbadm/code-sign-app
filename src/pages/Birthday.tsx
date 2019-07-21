import { AppBirthdayState, AppDayMonth, AppParticipant } from 'electron';
import React, { FC } from 'react';
import { Button } from 'react-desktop/windows';
import { saveAs } from '../util';
import './Birthday.css';
const { ipcRenderer } = window.require('electron');

const changeDate = (type: 'fromDate' | 'toDate', newDate: AppDayMonth) =>
  ipcRenderer.send('birthday', { type, newDate });

const setDay = (day: number, prev: AppDayMonth, type: 'fromDate' | 'toDate') => {
  day = Math.max(1, Math.min(monthsMaxDay[prev.month], day));
  const ok = day !== prev.day;
  if (ok) {
    changeDate(type, { day, month: prev.month });
  }
  return ok;
};

const onDayBlur = (
  e: React.KeyboardEvent<HTMLTableDataCellElement> | React.FocusEvent<HTMLTableDataCellElement>,
  prev: AppDayMonth,
  type: 'fromDate' | 'toDate',
): void => {
  const day = Number(e.currentTarget.innerText);
  if (!isNaN(day) && !setDay(day, prev, type)) {
    e.currentTarget.innerText = String(prev.day);
  }
};

const onDayKeyDown = (
  e: React.KeyboardEvent<HTMLTableDataCellElement>,
  prev: AppDayMonth,
  type: 'fromDate' | 'toDate',
): void => {
  if (e.keyCode === 13) {
    e.preventDefault();
    const day = Number(e.currentTarget.innerText);
    if (!isNaN(day) && !setDay(day, prev, type)) {
      e.currentTarget.innerText = String(prev.day);
    }
  } else if (e.keyCode === 38 /* up key */) {
    const day = Number(e.currentTarget.innerText) + 1;
    if (!isNaN(day)) {
      setDay(day, prev, type);
    }
  } else if (e.keyCode === 40 /* down key */) {
    const day = Number(e.currentTarget.innerText) - 1;
    if (!isNaN(day)) {
      setDay(day, prev, type);
    }
  }
};

const onMonthChange = (
  e: React.ChangeEvent<HTMLSelectElement>,
  prev: AppDayMonth,
  type: 'fromDate' | 'toDate',
): void => {
  const month = Number(e.target.value);
  if (!isNaN(month) && month !== prev.month && month >= 0 && month <= 11) {
    changeDate(type, { day: Math.min(prev.day, monthsMaxDay[month]), month });
  }
};

interface IBirthdayProps extends AppBirthdayState {
  participants: AppParticipant[];
}

export const Birthday: FC<IBirthdayProps> = (props) => {
  const fromDateScalar = props.fromDate.month * 100 + props.fromDate.day;
  const toDateScalar = props.toDate.month * 100 + props.toDate.day;
  const data = props.participants
    .filter(({ birthDate }) => {
      const birthDateDate = new Date(birthDate);
      const birthDateScalar = birthDateDate.getMonth() * 100 + birthDateDate.getDate();
      return birthDateScalar >= fromDateScalar && birthDateScalar <= toDateScalar;
    })
    .sort((a, b) => {
      const aDate = new Date(a.birthDate);
      const bDate = new Date(b.birthDate);
      return aDate.getMonth() * 100 + aDate.getDate() - bDate.getMonth() * 100 - bDate.getDate();
    });

  return (
    <div className="Birthday">
      <div className="config">
        <table>
          <tbody>
            <tr>
              <th>Даты с:</th>
              <td
                contentEditable={true}
                suppressContentEditableWarning={true}
                children={props.fromDate.day}
                onBlur={(e) => onDayBlur(e, props.fromDate, 'fromDate')}
                onKeyDown={(e) => onDayKeyDown(e, props.fromDate, 'fromDate')}
              />
              <td>
                <select
                  value={props.fromDate.month}
                  onChange={(e) => onMonthChange(e, props.fromDate, 'fromDate')}
                >
                  {monthsMap.map((label, value) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <th>Даты по:</th>
              <td
                contentEditable={true}
                suppressContentEditableWarning={true}
                children={props.toDate.day}
                onBlur={(e) => onDayBlur(e, props.toDate, 'toDate')}
                onKeyDown={(e) => onDayKeyDown(e, props.toDate, 'toDate')}
              />
              <td>
                <select
                  value={props.toDate.month}
                  onChange={(e) => onMonthChange(e, props.toDate, 'toDate')}
                >
                  {monthsMap.map((label, value) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="bordered" cellSpacing="0">
        <thead>
          <tr>
            <td>День рождения</td>
            <td>Имя</td>
            <td>Полная дата рождения</td>
          </tr>
        </thead>
        <tbody>
          {data.map((p, idx) => {
            const birthDate = new Date(p.birthDate);
            return (
              <tr key={idx}>
                <td>
                  {birthDate.getDate()} {monthsMap[birthDate.getMonth()]}
                </td>
                <td>{p.name}</td>
                <td>{birthDate.toLocaleDateString('ru')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button
        children="Экспорт в CSV"
        onClick={() =>
          saveAs(
            'День рождения,Имя,Полная дата рождения\n' +
              data
                .map((p) => {
                  const birthDate = new Date(p.birthDate);
                  return `${birthDate.getDate()} ${monthsMap[birthDate.getMonth()]},${
                    p.name
                  },${birthDate.toLocaleDateString('ru')}`;
                })
                .join('\n'),
            `именинники-${props.fromDate.day}${monthsMap[props.fromDate.month]}-${
              props.toDate.day
            }${monthsMap[props.toDate.month]}`,
          )
        }
      />
    </div>
  );
};

const monthsMap = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const monthsMaxDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
