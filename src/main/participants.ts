import faker from 'faker';
import { Storage } from "./storage";

interface IParticipant {
  name: string;
  team: number;
  years: number; // to delete
  birthDate: number;
  city: any;
  veteran: boolean;
  height: number;
  weight: number;
  bmi: number;
  parent: string;
}

interface IParticipantsState {
  items: IParticipant[];
}

export class ParticipantsStorage extends Storage {
  protected state!: IParticipantsState;

  constructor() {
    super("participants");

    if (!this.state.items) {
      faker.locale = 'ru';
      const fakeParticipantsCount = 30;
      this.state.items = new Array(fakeParticipantsCount);
    
      const cities = new Array(6);
      for (let i = 0; i < 6; i++) {
        cities[i] = faker.address.city();
      }
    
      for (let i = 0; i < fakeParticipantsCount; i++) {
        const height = faker.random.number(60) + 120;
        const weight = faker.random.number(70) + 25;
        this.state.items[i] = {
          name: faker.name.findName(),
          team: faker.random.number(15) + 1,
          years: faker.random.number(120) / 10 + 6, // to delete
          birthDate: faker.random.number(433900800000) + 946684800000,
          city: cities[faker.random.number(5)],
          veteran: faker.random.boolean(),
          height,
          weight,
          bmi: (((weight / Math.pow(height / 100, 2)) * 10) | 0) / 10,
          parent: faker.fake('{{phone.phoneNumber}} {{name.firstName}}'),
        };
      }
    
      this.state.items.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
    }
  
    global.participants = this.state;
  }

  public ipcMessage([channel, type, payload]: ['participants', string, any]): IParticipantsState {
    if (channel !== this.channel) {
      return this.state;
    }
    console.log('[ParticipantsStorage] ipcMessage event', [channel, type, payload]);
    return this.state;
  }
}
