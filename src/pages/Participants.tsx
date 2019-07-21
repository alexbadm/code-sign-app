import { AppParticipant, AppParticipantsState, AppTeamsState } from 'electron';
import faker from 'faker';
import React, { FC } from 'react';
import { Button } from 'react-desktop/windows';
import { ParticipantsTable } from '../components/ParticipantsTable';
import './Participants.css';
const { ipcRenderer } = window.require('electron');

export const Participants: FC<
  AppParticipantsState & { teams: AppTeamsState; showModal: (p?: AppParticipant) => void }
> = ({ items, teams, showModal }) => (
  <div className="Participants">
    <h1>Общий список участников (всего {items.length})</h1>
    <div className="test">
      <h4>Тестирование</h4>
      <button
        onClick={() =>
          ipcRenderer.send('participants', {
            participant: generateFakeParticipant(),
            type: 'addParticipant',
          })
        }
        children="Generate 1 participant"
      />
      <button
        onClick={() =>
          ipcRenderer.send('participants', {
            participants: generateFakeParticipants(30),
            type: 'addParticipants',
          })
        }
        children="Generate 30 participants"
      />
      <button
        onClick={() => ipcRenderer.send('participants', { type: 'deleteFakes' })}
        children="Remove test data"
      />
    </div>
    <Button
      color="#2D9CDB"
      onClick={() => showModal()}
      children="Добавить участника"
      style={{ marginBottom: 16 }}
    />
    <ParticipantsTable
      items={items}
      filename="все-участники"
      teams={teams.teams}
      editParticipant={showModal}
    />
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
    birthDate: faker.random.number(433900800000) + 946684800000,
    bmi: (((weight / Math.pow(height / 100, 2)) * 10) | 0) / 10,
    city: getCities()[faker.random.number(citiesCount - 1)],
    height,
    isTest: true,
    name: faker.name.findName(),
    parent: faker.fake('{{phone.phoneNumber}} {{name.firstName}}'),
    team: null,
    veteran: faker.random.boolean(),
    weight,
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
