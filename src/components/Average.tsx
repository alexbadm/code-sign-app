import React, { FC } from 'react';
import './Average.css';

interface IAverageProps {
  avg: number;
  max: number;
  min: number;
}

export const Average: FC<IAverageProps> = ({ avg, max, min }) => (
  <span className="Average">
    <span className="min" title="минимальный">
      {min}
    </span>
    /
    <span className="avg" title="средний">
      {avg}
    </span>
    /
    <span className="max" title="максимальный">
      {max}
    </span>
  </span>
);
