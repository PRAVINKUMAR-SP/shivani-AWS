import React from 'react';

export const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'US/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+81', country: 'Japan' },
  { code: '+86', country: 'China' }
];

const CountryCodeDropdown = ({ value, onChange, className = '' }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent outline-none border-none text-slate-700 font-medium cursor-pointer ${className}`}
    >
      {countryCodes.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} ({c.country})
        </option>
      ))}
    </select>
  );
};

export default CountryCodeDropdown;
