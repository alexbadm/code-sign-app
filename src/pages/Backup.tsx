import React, { FC } from 'react';
import { Button } from 'react-desktop/windows';
import { saveAs } from '../util';
import './Backup.css';
const { ipcRenderer } = window.require('electron');

interface IBackupProps {
  birthday: Electron.AppBirthdayState;
  participants: Electron.AppParticipantsState;
  stages: Electron.AppStagesState;
  teams: Electron.AppTeamsState;
}

export const Backup: FC<IBackupProps> = (props) => {
  const fileRef = React.createRef<HTMLInputElement>();
  return (
    <div className="Backup">
      <h1>Резервное копирование</h1>
      <h2>Сохранение в файл</h2>
      <p>Сохранение текущего состояния приложения в файл для последующего использования</p>
      <Button
        children="Сохранить базу в файл"
        onClick={() => saveAs(JSON.stringify(props), 'db-backup', 'application/json')}
      />
      <h2>Восстановление из файла</h2>
      <p>Восстановление состояния приложения из файла. Все текущие изменения будут потеряны.</p>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        onChange={(event) => {
          const fileList = event.currentTarget.files;
          if (fileList && fileList.length === 1) {
            restore(fileList[0]);
          }
        }}
      />
      <Button
        children="Восстановить из файла"
        onClick={() => fileRef.current && fileRef.current.click()}
      />
    </div>
  );
};

function restore(file: File): void {
  const reader = new FileReader();
  reader.onloadend = loadendHandler;
  reader.readAsText(file, 'utf8');
}

function loadendHandler(this: FileReader, _: ProgressEvent): void {
  if (this.error) {
    console.log(this.error.code, this.error.name, this.error.message);
    alert(`Ошибка загрузки файла:\n${this.error.code} ${this.error.name}\n${this.error.message}`);
    return;
  }
  if (!this.result) {
    alert(`Ошибка чтения файла: нет данных`);
    return;
  }
  if (typeof this.result !== 'string') {
    alert(`Ошибка чтения файла: неверный формат`);
    return;
  }
  try {
    const data = JSON.parse(this.result);
    ipcRenderer.send('backup', { type: 'restore', data });
  } catch (err) {
    alert('Ошибка чтения файла: ' + err);
  }
}
