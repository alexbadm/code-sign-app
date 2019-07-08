import React from 'react';
import './icons.css';

export function renderIcon(name: string) {
  switch (name) {
    case 'Участники':
      return <span className="Icon">👤</span>;
    case 'Команды':
      return <span className="Icon">⛺️</span>;
    case 'Сводка по городу':
      return <span className="Icon">🗺</span>;
    case 'Сводка по возрасту':
      // return <span className="Icon">🚸</span>;
      return <span className="Icon">👕</span>;
    case 'Именинники':
      return <span className="Icon">🎂</span>;
      // return <span className="Icon">🎁</span>;
    // return <span className="Icon">🎉</span>;
    case 'Этапы':
      return <span className="Icon">🎯</span>;
    // return <span className="Icon">🏹️</span>;
    // return <span className="Icon">⛳️</span>;
    // return <span className="Icon">📋</span>;
    case 'Результаты':
      return <span className="Icon">🏆</span>;
    //   return <span className="Icon">🏁</span>;
    case 'Настройка турнира':
      return <span className="Icon">🎛</span>;
    // return <span className="Icon">⚙️</span>;
    case 'Резервное копирование':
      return <span className="Icon">💾</span>;
    default:
      return <span className="Icon">⚫️</span>;
  }
}
