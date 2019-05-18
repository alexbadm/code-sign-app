import React, { Component } from 'react';
import { AppBirthdayState, AppParticipant } from 'electron';
const { ipcRenderer } = window.require('electron');

const changeDate = (type: 'fromDate' | 'toDate', newDate: number) =>
  ipcRenderer.send('birthday', { type, newDate });

interface IBirthdayProps extends AppBirthdayState {
  participants: AppParticipant[];
}

interface IBirthdayState {
  fromDate: string;
  toDate: string;
}

export class Birthday extends Component<IBirthdayProps, IBirthdayState> {
  constructor(props: IBirthdayProps) {
    super(props);
    this.state = {
      fromDate: new Date(props.fromDate).toLocaleDateString('ru'),
      toDate: new Date(props.toDate).toLocaleDateString('ru'),
    };
  }

  onChange(type: 'fromDate' | 'toDate', newValue: string) {
    this.setState({
      ...this.state,
      [type]: newValue,
    });
  }

  onBlur(type: 'fromDate' | 'toDate', newValue: string) {
    const split = newValue.split('.');
    const newDate = new Date(+split[2], +split[1] - 1, +split[0]);
    if (newDate.valueOf() !== this.props[type]) {
      changeDate(type, newDate.valueOf());
    }
  }

  render() {
    const { participants } = this.props;
    const fromDateDate = new Date(this.props.fromDate);
    const toDateDate = new Date(this.props.toDate);
    const fromDateScalar = fromDateDate.getMonth() * 100 + fromDateDate.getDate();
    const toDateScalar = toDateDate.getMonth() * 100 + toDateDate.getDate();
    return (
      <div className="Birthday">
        <div>
          <div>
            <label>Даты с:</label>
            <input
              type="text"
              value={this.state.fromDate}
              onChange={(e) => this.onChange('fromDate', e.target.value)}
              onBlur={(e) => this.onBlur('fromDate', e.target.value)}
              onKeyDown={(e) =>
                e.keyCode === 13 && this.onBlur('fromDate', (e.target as any).value)
              }
            />
          </div>
          <div>
            <label>Даты по:</label>
            <input
              type="text"
              value={this.state.toDate}
              onChange={(e) => this.onChange('toDate', e.target.value)}
              onBlur={(e) => this.onBlur('toDate', e.target.value)}
              onKeyDown={(e) => e.keyCode === 13 && this.onBlur('toDate', (e.target as any).value)}
            />
          </div>
        </div>

        <table className="bordered" cellSpacing="0">
          <thead>
            <tr>
              <td>Дата</td>
              <td>Именинники</td>
              <td>Дата рождения</td>
            </tr>
          </thead>
          <tbody>
            {participants
              .filter(({ birthDate }) => {
                const birthDateDate = new Date(birthDate);
                const birthDateScalar = birthDateDate.getMonth() * 100 + birthDateDate.getDate();
                return birthDateScalar > fromDateScalar && birthDateScalar < toDateScalar;
              })
              .sort((a, b) => {
                const aDate = new Date(a.birthDate);
                const bDate = new Date(b.birthDate);
                const re =
                  aDate.getMonth() * 100 +
                  aDate.getDate() -
                  bDate.getMonth() * 100 -
                  bDate.getDate();
                return re;
              })
              .map((p, idx) => {
                const birthDate = new Date(p.birthDate);
                return (
                  <tr key={idx}>
                    <td>
                      {monthsMap[birthDate.getMonth()]} {birthDate.getDate()}
                    </td>
                    <td>{p.name}</td>
                    <td>{birthDate.toLocaleDateString('ru')}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

const monthsMap = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];
