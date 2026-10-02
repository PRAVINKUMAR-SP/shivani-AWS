import React, { useState, useEffect } from 'react';
import CountryCodeDropdown from './CountryCodeDropdown';

const PhoneInputWithCountry = ({ value = '', onChange, className = '', placeholder = 'Mobile Number' }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (value) {
      // Basic splitting logic. Assumes a space separates country code if it was saved that way.
      // E.g., "+91 9876543210"
      if (value.includes(' ')) {
        const parts = value.split(' ');
        setCountryCode(parts[0]);
        setPhoneNumber(parts.slice(1).join(' '));
      } else {
        // If no space, it might be just the number or prepended
        if (value.startsWith('+')) {
          // just guess it's a code up to 3 digits. This is a fallback
          // Ideally, the DB has the space because we save it as `${countryCode} ${phoneNo}`
          setPhoneNumber(value);
        } else {
          setPhoneNumber(value);
        }
      }
    }
  }, [value]);

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,10}$/.test(val)) {
      setPhoneNumber(val);
      onChange(`${countryCode} ${val}`);
    }
  };

  const handleCodeChange = (code) => {
    setCountryCode(code);
    onChange(`${code} ${phoneNumber}`);
  };

  return (
    <div className={`flex bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden ${className}`}>
      <div className="flex items-center px-3 border-r border-slate-200 bg-slate-100">
        <CountryCodeDropdown value={countryCode} onChange={handleCodeChange} className="text-sm bg-transparent" />
      </div>
      <input 
        type="tel" 
        placeholder={placeholder}
        value={phoneNumber} 
        onChange={handlePhoneChange} 
        className="w-full px-4 py-3 bg-transparent border-none focus:outline-none" 
      />
    </div>
  );
};

export default PhoneInputWithCountry;
