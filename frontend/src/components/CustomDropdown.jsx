import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, colorMap = {}, defaultColorClass = 'bg-white border-slate-200 text-slate-700', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentColorClass = colorMap[value] || defaultColorClass;
  // Try to extract a text color class to color the chevron, or fallback to default
  const textColorClass = currentColorClass.match(/text-[a-z]+-[0-9]+/)?.[0] || 'text-slate-500';

  const selectedOption = options.find(o => o.value === value) || { label: value, value };

  return (
    <div className={`relative inline-block text-left w-full min-w-[120px] ${className}`} ref={dropdownRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-xl border shadow-sm transition-all outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500/50 hover:shadow ${currentColorClass}`}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${textColorClass}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-max rounded-xl bg-white shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="py-1">
            {options.map((opt) => {
              const optColorClass = colorMap[opt.value] || 'text-slate-700 hover:bg-slate-50 hover:text-blue-600';
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                    value === opt.value 
                      ? optColorClass 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
