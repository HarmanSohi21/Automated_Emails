import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  containerWidth?: string;
  disabled?: boolean;
  openUpward?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  error,
  containerWidth = 'auto',
  disabled = false,
  openUpward = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const containerStyle = containerWidth === 'auto' ? {} : { width: containerWidth };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Focus the search input when opening
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  return (
    <div className="relative" style={containerStyle} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-8">
          {label}
        </label>
      )}
      
      {/* Dropdown Trigger */}
      <div
        onClick={handleToggle}
        className={`
          relative w-full pl-16 pr-40 py-10 text-sm border bg-white rounded-lg cursor-pointer transition-all duration-200
          ${isOpen 
            ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
            : error 
              ? 'border-error-500' 
              : 'border-neutral-300 hover:border-neutral-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : ''}
        `}
      >
        <span className={`block truncate ${selectedOption ? 'text-neutral-900' : 'text-neutral-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="absolute inset-y-0 right-12 flex items-center pointer-events-none">
          <ChevronDown 
            className={`w-16 h-16 text-neutral-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute z-50 w-full bg-white border border-neutral-200 rounded-lg shadow-xl max-h-240 overflow-hidden
          ${openUpward ? 'bottom-full mb-4' : 'top-full mt-4'}
        `}>
          {/* Search Input */}
          <div className="p-12 border-b border-neutral-100">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..."
              className="w-full px-12 py-8 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Options List */}
          <div className="max-h-200 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-16 py-12 text-sm text-neutral-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => !option.disabled && handleOptionClick(option.value)}
                  className={`
                    flex items-center justify-between px-16 py-10 text-sm cursor-pointer transition-colors
                    ${option.disabled 
                      ? 'text-neutral-400 cursor-not-allowed' 
                      : option.value === value
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-900 hover:bg-neutral-50'
                    }
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-16 h-16 text-primary-600 flex-shrink-0 ml-12" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <span className="mt-6 text-sm text-error-600">{error}</span>
      )}
    </div>
  );
};