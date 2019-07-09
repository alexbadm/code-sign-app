import React from 'react';
import './icons.css';

export function renderIcon(name: string) {
  switch (name) {
    case 'Участники':
      return (
        <span aria-label="participants" className="Icon" role="img">
          👤
        </span>
      );
    case 'Команды':
      return (
        <span aria-label="teams" className="Icon" role="img">
          ⛺️
        </span>
      );
    case 'Сводка по городу':
      return (
        <span aria-label="by city" className="Icon" role="img">
          🗺
        </span>
      );
    case 'Сводка по возрасту':
      // return <span className="Icon" role="img">🚸</span>;
      return (
        <span aria-label="by age" className="Icon" role="img">
          👕
        </span>
      );
    case 'Именинники':
      return (
        <span aria-label="birthdays" className="Icon" role="img">
          🎂
        </span>
      );
    // return <span className="Icon" role="img">🎁</span>;
    // return <span className="Icon" role="img">🎉</span>;
    case 'Этапы':
      return (
        <span aria-label="stages" className="Icon" role="img">
          🎯
        </span>
      );
    // return <span className="Icon" role="img">🏹️</span>;
    // return <span className="Icon" role="img">⛳️</span>;
    // return <span className="Icon" role="img">📋</span>;
    case 'Результаты':
      return (
        <span aria-label="results" className="Icon" role="img">
          🏆
        </span>
      );
    //   return <span className="Icon" role="img">🏁</span>;
    case 'Настройка турнира':
      return (
        <span aria-label="settings" className="Icon" role="img">
          🎛
        </span>
      );
    // return <span className="Icon" role="img">⚙️</span>;
    case 'Резервное копирование':
      return (
        <span aria-label="backup" className="Icon" role="img">
          💾
        </span>
      );
    default:
      return (
        <span aria-label="item" className="Icon" role="img">
          ⚫️
        </span>
      );
  }
}
