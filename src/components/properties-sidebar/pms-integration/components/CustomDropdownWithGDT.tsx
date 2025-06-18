import React, { useState, useRef, useEffect } from 'react';
import { GDTMappingService } from '../../../../services/GDTMappingService';
import { Plus, ChevronDown } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface CustomDropdownWithGDTProps {
  options: DropdownOption[];
  onSelect: (value: string) => void;
  placeholder: string;
  className?: string;
  disabled?: boolean;
}

export const CustomDropdownWithGDT: React.FC<CustomDropdownWithGDTProps> = ({
  options,
  onSelect,
  placeholder,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gdtCode, setGdtCode] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleGdtCodeAdd = () => {
    if (!gdtCode.trim()) return;
    
    const variable = GDTMappingService.gdtCodeToVariable(gdtCode.trim());
    if (variable) {
      onSelect(variable);
      setGdtCode('');
      setIsOpen(false);
    } else {
      // Show error or handle invalid GDT code
      alert(`GDT Code "${gdtCode}" not found in mapping table.`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGdtCodeAdd();
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`input w-full flex items-center justify-between ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className="text-gray-500">{placeholder}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Standard options */}
          <div className="max-h-48 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                {placeholder.includes('question') ? 'No other questions available' : 'No options available'}
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                >
                  {option.label}
                </button>
              ))
            )}
          </div>

          {/* GDT Code input section */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Add GDT Code Variable
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter GDT code"
                value={gdtCode}
                onChange={(e) => setGdtCode(e.target.value)}
                onKeyPress={handleKeyPress}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                onClick={handleGdtCodeAdd}
                disabled={!gdtCode.trim()}
                className={`btn flex items-center ${
                  !gdtCode.trim() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'btn-primary hover:bg-blue-700'
                }`}
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              e.g., 3101 → Patient Name
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 