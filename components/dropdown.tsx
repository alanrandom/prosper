import React from 'react';

type DateDropdownProps = {
  options: string[];
  value: string | null;
  onChange: (date: string) => void;
  label?: string;
};

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

const DateDropdown: React.FC<DateDropdownProps> = ({ options, value, onChange, label }) => {
  return (
    <div>
      {label && <label style={{ marginRight: '0.5rem' }}>{label}</label>}
      <select
        value={value || "fail"}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateDropdown;