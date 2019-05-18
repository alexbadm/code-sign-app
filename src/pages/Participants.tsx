import React, { FC } from 'react';
import faker from 'faker';
import './Participants.css';
import { AppParticipantsState, AppParticipant } from 'electron';
const { ipcRenderer } = window.require('electron');

const today = new Date();

export const Participants: FC<AppParticipantsState> = ({ items }) => (
  <div className="Participants">
    <div className="test">
      <h4>Testing</h4>
      <button
        onClick={() =>
          ipcRenderer.send('participants', {
            type: 'addParticipant',
            participant: generateFakeParticipant(),
          })
        }
      >
        Generate 1 participant
      </button>
      <button
        onClick={() =>
          ipcRenderer.send('participants', {
            type: 'addParticipants',
            participants: generateFakeParticipants(30),
          })
        }
      >
        Generate 30 participants
      </button>
      <button
        onClick={() =>
          ipcRenderer.send('participants', {
            type: 'deleteFakes',
          })
        }
      >
        Remove test data
      </button>
    </div>
    <table className="bordered" cellSpacing="0">
      <thead>
        <tr>
          <td title="Фамилия и имя">Ф.И.</td>
          <td>команда</td>
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
        {items.map((p, idx) => (
          <tr key={idx}>
            <td>{p.name}</td>
            <td>{p.team === null ? '<не распределен>' : p.team}</td>
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

let cities: string[];
const citiesCount = 6;
faker.locale = 'ru';

function getCities(): string[] {
  if (!cities) {
    cities = new Array(citiesCount);
    for (let i = 0; i < citiesCount; i++) {
      cities[i] = faker.address.city();
    }
  }
  return cities;
}

function generateFakeParticipant(): AppParticipant {
  const height = faker.random.number(60) + 120;
  const weight = faker.random.number(70) + 25;
  return {
    name: faker.name.findName(),
    team: null,
    years: faker.random.number(120) / 10 + 6, // to delete
    birthDate: faker.random.number(433900800000) + 946684800000,
    city: getCities()[faker.random.number(citiesCount - 1)],
    veteran: faker.random.boolean(),
    height,
    weight,
    bmi: (((weight / Math.pow(height / 100, 2)) * 10) | 0) / 10,
    parent: faker.fake('{{phone.phoneNumber}} {{name.firstName}}'),
    isTest: true,
  };
}

function generateFakeParticipants(count: number): AppParticipant[] {
  const fakes: AppParticipant[] = new Array(count);
  for (let i = 0; i < count; i++) {
    fakes[i] = generateFakeParticipant();
  }
  fakes.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
  return fakes;
}
