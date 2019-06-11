import React, { Component } from 'react';
import { Button } from 'react-desktop/windows';
import { TextInput, Checkbox } from './input';
import './newParticipantForm.css';
import { AppParticipant } from 'electron';
const { ipcRenderer } = window.require('electron');

interface IParticipantState {
  name: string;
  birthDate: string;
  birthDateOk: boolean;
  city: string;
  veteran: boolean;
  height: string;
  weight: string;
  parent: string;
}

const clearState: IParticipantState = {
  name: '',
  birthDate: '',
  birthDateOk: false,
  city: '',
  veteran: false,
  height: '',
  weight: '',
  parent: '',
};

export class NewParticipantForm extends Component<any, IParticipantState> {
  constructor(props: any) {
    super(props);
    this.state = clearState;
  }

  render() {
    return (
      <div className="NewParticipantForm">
        <h3>Добавление участника</h3>
        <TextInput
          label="Фамилия, имя"
          validate={(v: string) => v.length > 4}
          value={this.state.name}
          onChange={(e: any) => this.setState({ ...this.state, name: e.target.value })}
        />
        <TextInput
          label="Дата рождения"
          validate={() => this.state.birthDateOk}
          value={this.state.birthDate}
          onChange={(e: any) => {
            const match = /(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(e.target.value);
            if (match) {
              const date = Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
              this.setState({
                ...this.state,
                birthDate: e.target.value,
                birthDateOk: date < 1546300800000 && date > 946684800000,
              });
            } else {
              this.setState({ ...this.state, birthDate: e.target.value, birthDateOk: false });
            }
          }}
        />
        <TextInput
          label="Населенный пункт"
          validate={(v: string) => v.length > 2}
          value={this.state.city}
          onChange={(e: any) => this.setState({ ...this.state, city: e.target.value })}
        />
        <TextInput
          label="Рост (см)"
          validate={(v: string) => {
            if (!v) return false;
            const val = Number(v);
            return !isNaN(val) && val > 70 && val < 250;
          }}
          value={this.state.height}
          onChange={(e: any) => this.setState({ ...this.state, height: e.target.value })}
        />
        <TextInput
          label="Вес (кг)"
          validate={(v: string) => {
            if (!v) return false;
            const val = Number(v);
            return !isNaN(val) && val > 15 && val < 300;
          }}
          value={this.state.weight}
          onChange={(e: any) => this.setState({ ...this.state, weight: e.target.value })}
        />
        <TextInput
          label="Контакт родителя (опекуна)"
          validate={(v: string) => v.length > 5}
          value={this.state.parent}
          onChange={(e: any) => this.setState({ ...this.state, parent: e.target.value })}
        />
        <Checkbox
          label="Участвовал ли ранее в КЗ"
          onChange={(e: any) => this.setState({ ...this.state, veteran: e.currentTarget.checked })}
          checked={this.state.veteran}
        />
        <Button
          onClick={() => {
            let birthDate = 0;
            const match = /(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(this.state.birthDate);
            if (match) {
              birthDate = Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
            }

            const height = Number(this.state.height);
            const weight = Number(this.state.weight);

            const participant: AppParticipant = {
              name: this.state.name,
              team: null,
              birthDate,
              city: this.state.city,
              veteran: this.state.veteran,
              height,
              weight,
              bmi: (((weight / Math.pow(height / 100, 2)) * 10) | 0) / 10,
              parent: this.state.parent,
              isTest: false,
            };

            ipcRenderer.send('participants', {
              type: 'addParticipant',
              participant,
            });
            this.setState(clearState);
          }}
        >
          Добавить
        </Button>
        <Button onClick={() => this.setState(clearState)}>Сбросить</Button>
      </div>
    );
  }
}
