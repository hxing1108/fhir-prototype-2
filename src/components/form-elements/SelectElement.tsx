import React, { useState, useRef, useEffect } from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface SelectElementProps {
  element: FormElement;
}

const SelectElement: React.FC<SelectElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(element.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleLabelClick = () => {
    setIsEditing(true);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value);
  };

  const handleLabelBlur = () => {
    setIsEditing(false);
    if (labelText.trim() !== element.label) {
      updateElement(element.id, { label: labelText.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLabelBlur();
    }
    if (e.key === 'Escape') {
      setLabelText(element.label);
      setIsEditing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={labelText}
            onChange={handleLabelChange}
            onBlur={handleLabelBlur}
            onKeyDown={handleKeyDown}
            className="label w-full bg-transparent border-b border-primary-500 focus:outline-none px-0"
          />
        ) : (
          <label className="label cursor-text" onClick={handleLabelClick}>
            {element.label}
            {element.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
      </div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      <select className="input" disabled>
        <option value="" disabled selected>
          {element.placeholder || 'Select an option'}
        </option>
        {element.options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectElement;