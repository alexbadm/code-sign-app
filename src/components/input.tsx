import React, { FC } from 'react';

interface ITextInputProps {
  label: string;
  value?: string;
  onChange?: (e: any) => void;
  isOk?: any;
  validate?: (value: any) => boolean;
}

export const TextInput: FC<ITextInputProps> = ({ label, value, onChange, validate }) => (
  <div className="TextInput input">
    <label>
      {label} {validate && validate(value) ? '✔️' : ''}
      <input type="text" value={value} onChange={onChange} />
    </label>
  </div>
);

interface ICheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (e: any) => void;
}

export const Checkbox: FC<ICheckboxProps> = ({ label, checked, onChange }) => (
  <div className="Checkbox input">
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  </div>
);

interface ISelectProps {
  label: string;
  items?: Array<{ id: number; name: string | null }>;
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export const Select: FC<ISelectProps> = ({ label, items, selected, onSelect }) =>
  !items ? null : (
    <div className="Select input">
      <label>
        {label}
        <select
          onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
          value={selected === null ? '' : selected}
        >
          <option value="" />
          {items.map((item, idx) => (
            <option key={idx} value={item.id}>
              {item.name || `#${item.id}`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
