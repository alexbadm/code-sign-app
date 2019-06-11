import React, { FC } from 'react';
import { Button } from 'react-desktop/windows';
import faker from 'faker';
import './Participants.css';
import { AppParticipantsState, AppParticipant, AppTeamsState } from 'electron';
import { ParticipantsTable } from '../components/ParticipantsTable';
const { ipcRenderer } = window.require('electron');

export const Participants: FC<AppParticipantsState & { teams: AppTeamsState, showModal: () => void }> = ({
  items,
  teams,
  showModal,
}) => (
  <div className="Participants">
    <Button
      color="#2D9CDB"
      onClick={showModal}
      children="Добавить участника"
      style={{ marginBottom: 16 }}
    />
    <div className="test">
      <h4>Тестирование</h4>
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
    <ParticipantsTable items={items} teams={teams.teams} />
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
