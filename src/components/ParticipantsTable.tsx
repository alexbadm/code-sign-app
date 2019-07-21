import { AppParticipant, AppTeamsTeam } from 'electron';
import React, { FC } from 'react';
import { Button } from 'react-desktop/windows';
import './ParticipantsTable.css';
const { ipcRenderer } = window.require('electron');

type IHeaders = Record<string, { header: string; title?: string }>;

const defaultHeaders: IHeaders = {
  actions: { header: 'действия' },
  birthDate: { header: 'дата рожд.' },
  bmi: { header: 'ИМТ', title: 'Индекс массы тела' },
  city: { header: 'нас.пункт' },
  height: { header: 'рост, см' },
  name: { header: 'Ф.И.', title: 'Фамилия и имя' },
  parent: { header: 'родитель' },
  team: { header: 'команда' },
  veteran: { header: 'ветеран', title: 'Участвовал ли в КЗ ранее' },
  weight: { header: 'вес, кг' },
  years: { header: 'кол-во лет' },
};

type IConfig = Array<{ name: string; isOn: boolean; isCsvOn: boolean }>;

const defaultConfig: IConfig = [
  { name: 'name', isOn: true, isCsvOn: true },
  { name: 'team', isOn: true, isCsvOn: true },
  { name: 'birthDate', isOn: true, isCsvOn: true },
  { name: 'years', isOn: true, isCsvOn: true },
  { name: 'city', isOn: true, isCsvOn: true },
  { name: 'veteran', isOn: true, isCsvOn: true },
  { name: 'height', isOn: true, isCsvOn: true },
  { name: 'weight', isOn: true, isCsvOn: true },
  { name: 'bmi', isOn: true, isCsvOn: true },
  { name: 'parent', isOn: true, isCsvOn: true },
  { name: 'actions', isOn: true, isCsvOn: false },
];

const makeDomHeader = (config: IConfig, headers: IHeaders) => (
  <thead>
    <tr>
      {config
        .filter((c) => c.isOn)
        .map((c, idx) => (
          <td key={idx} title={headers[c.name].title}>
            {headers[c.name].header}
          </td>
        ))}
    </tr>
  </thead>
);

const makeDomBody = (config: IConfig, items: any[]) => {
  const conf = config.filter((c) => c.isOn);
  return (
    <tbody>
      {items.map((item, idx) => (
        <tr key={idx}>
          {conf.map((c, i) => (
            <td key={i} className={c.name}>
              {item[c.name]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const makeCsvHeader = (config: IConfig, headers: IHeaders) =>
  config
    .filter((c) => c.isCsvOn)
    .map((c) => headers[c.name].header.replace(',', ''))
    .join(',');

const makeCsvBody = (config: IConfig, items: any[]) => {
  const conf = config.filter((c) => c.isCsvOn);
  return items.map((item) => conf.map((c) => item[c.name]).join(',')).join('\n');
};

const makeCsv = (config: IConfig, headers: IHeaders, items: any[]) =>
  makeCsvHeader(config, headers) + '\n' + makeCsvBody(config, items);

const today = Date.now();

interface IParticipantsTableProps {
  config?: IConfig;
  filename: string;
  items: AppParticipant[];
  teams?: AppTeamsTeam[];
  editParticipant?: (p: AppParticipant) => void;
}

export const ParticipantsTable: FC<IParticipantsTableProps> = ({
  config,
  filename,
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

  const conf: IConfig = config || defaultConfig;

  const actionConfItem = conf.find((c) => c.name === 'actions');
  if (actionConfItem) {
    actionConfItem.isOn = !!editParticipant;
    actionConfItem.isCsvOn = false;
  }

  const teamConfItem = conf.find((c) => c.name === 'team');
  if (!teams && teamConfItem) {
    teamConfItem.isOn = teamConfItem.isCsvOn = false;
  }

  const participantsData: Array<Record<string, any>> = items.map((p) => ({
    ...p,
    birthDate: new Date(p.birthDate).toLocaleDateString('ru'),
    ref: p,
    team:
      p.team === null
        ? '<не распределен>'
        : (p.team in teamsIndex && teamsIndex[p.team].name) || '<unnamed> #' + p.team,
    veteran: p.veteran ? 'да' : 'нет',
    years: Math.floor((today - p.birthDate) / 3153600000) / 10,
  }));

  if (editParticipant) {
    participantsData.forEach((p) => {
      p.actions = (
        <span>
          <span aria-label="edit" role="img" onClick={() => editParticipant(p.ref)} title="править">
            ✏️
          </span>
          &nbsp;
          <span aria-label="delete" role="img" onClick={() => delConfirm(p.ref)} title="удалить">
            ✖️
          </span>
        </span>
      );
    });
  }

  return (
    <div className="ParticipantsTable">
      <Button
        children="Экспорт в CSV"
        onClick={() => csvExport(conf, defaultHeaders, participantsData, filename)}
      />
      <table className="bordered" cellSpacing="0">
        {makeDomHeader(conf, defaultHeaders)}
        {makeDomBody(
          conf,
          participantsData.map((p) => ({
            ...p,
            years: (
              <span>
                <span className="int">{p.years | 0}</span>
                <span className="tenth">{((p.years * 10) | 0) % 10}</span>
              </span>
            ),
          })),
        )}
      </table>
    </div>
  );
};

function delConfirm(participant: AppParticipant) {
  if (window.confirm(`Подтверждаете удаление участника ${participant.name}?`)) {
    ipcRenderer.send('participants', { type: 'deleteParticipant', name: participant.name });
  }
}

function csvExport(config: IConfig, headers: IHeaders, items: any[], filename: string) {
  const a = document.createElement('a');
  a.download = `${filename}-${new Date().toISOString()}.csv`;
  a.href = 'data:text/csv;charset=utf-8,' + makeCsv(config, headers, items);
  a.click();
  a.remove();
}
