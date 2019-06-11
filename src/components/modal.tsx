import React, { FC } from 'react';
import './modal.css';

interface IModalProps {
  height?: number;
  width?: number;

  onBackgroundClick?: () => void;
}

export const Modal: FC<IModalProps> = ({ children, height, width, onBackgroundClick }) => {
  const onClick = (e: any) => {
    if (onBackgroundClick && e.target === e.currentTarget) {
      onBackgroundClick();
    }
  };
  return (
    <div className="Modal" onClick={onClick}>
      <div className="positioner" onClick={onClick} style={{ height, width }}>
        <div className="wrap">{children}</div>
      </div>
    </div>
  );
};
