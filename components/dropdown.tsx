import React from 'react';

type DateDropdownProps = {
  options: Date[];
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
};

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

const DateDropdown: React.FC<DateDropdownProps> = ({ options, value, onChange, label }) => {
  return (
    <div>
      {label && <label style={{ marginRight: '0.5rem' }}>{label}</label>}
      <select
        value={value?.toISOString()}
        onChange={(e) => onChange(new Date(e.target.value))}
      >
        {options.map((date) => (
          <option key={date.toISOString()} value={date.toISOString()}>
            {formatDateLabel(date)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateDropdown;