import { AppParticipant, AppTeamsTeam } from 'electron';
import React, { Component } from 'react';
import { Button } from 'react-desktop/windows';
import { Checkbox, Select, TextInput } from './input';
import './ParticipantForm.css';
const { ipcRenderer } = window.require('electron');

interface IPartFormProps {
  editParticipant: AppParticipant | undefined;
  closeModal: () => void;
  teams?: AppTeamsTeam[];
}

interface IPartFormState {
  name: string;
  team: number | null;
  birthDate: string;
  birthDateOk: boolean;
  city: string;
  veteran: boolean;
  height: string;
  weight: string;
  parent: string;
  isTest: boolean;
}

const clearState: Readonly<IPartFormState> = {
  birthDate: '',
  birthDateOk: false,
  city: '',
  height: '',
  isTest: false,
  name: '',
  parent: '',
  team: null,
  veteran: false,
  weight: '',
};

export class ParticipantForm extends Component<IPartFormProps, IPartFormState> {
  constructor(props: IPartFormProps) {
    super(props);
    if (props.editParticipant) {
      this.state = {
        birthDate: new Date(props.editParticipant.birthDate).toLocaleDateString('ru'),
        birthDateOk: true,
        city: props.editParticipant.city,
        height: String(props.editParticipant.height),
        isTest: props.editParticipant.isTest,
        name: props.editParticipant.name,
        parent: props.editParticipant.parent,
        team: props.editParticipant.team,
        veteran: props.editParticipant.veteran,
        weight: String(props.editParticipant.weight),
      };
    } else {
      this.state = clearState;
    }
  }

  public render() {
    const { closeModal, editParticipant, teams } = this.props;
    return (
      <div className="ParticipantForm">
        <h3>
          {editParticipant
            ? `Правка записи участника "${editParticipant.name}"`
            : 'Добавление участника'}
        </h3>
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
            if (!v) {
              return false;
            }
            const val = Number(v);
            return !isNaN(val) && val > 70 && val < 250;
          }}
          value={this.state.height}
          onChange={(e: any) => this.setState({ ...this.state, height: e.target.value })}
        />
        <TextInput
          label="Вес (кг)"
          validate={(v: string) => {
            if (!v) {
              return false;
            }
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
        <Select
          label="Команда"
          items={teams}
          selected={this.state.team}
          onSelect={(id: number | null) => this.setState({ ...this.state, team: id })}
        />
        <Checkbox
          label="Участвовал ли ранее в КЗ"
          onChange={(e: any) => this.setState({ ...this.state, veteran: e.currentTarget.checked })}
          checked={this.state.veteran}
        />
        <Button
          children={editParticipant ? 'Сохранить' : 'Добавить'}
          onClick={() => {
            let birthDate = 0;
            const match = /(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(this.state.birthDate);
            if (match) {
              birthDate = Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
            }

            const height = Number(this.state.height);
            const weight = Number(this.state.weight);

            const participant: AppParticipant = {
              birthDate,
              bmi: (((weight / Math.pow(height / 100, 2)) * 10) | 0) / 10,
              city: this.state.city,
              height,
              isTest: this.state.isTest,
              name: this.state.name,
              parent: this.state.parent,
              team: this.state.team,
              veteran: this.state.veteran,
              weight,
            };

            if (editParticipant) {
              ipcRenderer.send('participants', {
                name: editParticipant.name,
                participant,
                type: 'editParticipant',
              });
              closeModal();
            } else {
              ipcRenderer.send('participants', {
                participant,
                type: 'addParticipant',
              });
              this.setState(clearState);
            }
          }}
        />
        {editParticipant ? (
          <Button onClick={closeModal}>Отмена</Button>
        ) : (
          <Button onClick={() => this.setState(clearState)}>Сбросить</Button>
        )}
      </div>
    );
  }
}
