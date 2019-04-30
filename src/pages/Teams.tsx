import React, { FC } from 'react';

interface ITeamsProps {
  teams: {};
  config: {
    algorithm: 'teamSize' | 'teamsCount';
    teamSize: number;
    teamsCount: number;
  };
}

export const Teams: FC<ITeamsProps> = ({ config, teams }) => (
  <div className="Teams">
    <div className="config">
      <div>
        <input name="algorithm" type="radio" value="teamSize" checked={config.algorithm === 'teamSize'} />
        <label>Размер команды</label>
        <input
          type="number"
          step="1"
          min="0"
          disabled={config.algorithm === 'teamsCount'}
          value={config.teamSize}
        />
      </div>
      <div>
        <input name="algorithm" type="radio" value="teamsCount" checked={config.algorithm === 'teamsCount'} />
        <label>Количество команд</label>
        <input
          type="number"
          step="1"
          min="0"
          disabled={config.algorithm === 'teamSize'}
          value={config.teamsCount}
        />
      </div>
    </div>
  </div>
);
