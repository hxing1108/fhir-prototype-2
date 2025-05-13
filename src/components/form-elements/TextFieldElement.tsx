import React, { useState, useRef, useEffect } from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface TextFieldElementProps {
  element: FormElement;
}

const TextFieldElement: React.FC<TextFieldElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(element.label);
  const [value, setValue] = useState(element.defaultValue?.toString() || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const getInputType = () => {
    switch (element.type) {
      case 'email':
        return 'email';
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  };

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

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateElement(element.id, { defaultValue: newValue });
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
      <input
        ref={valueInputRef}
        type={getInputType()}
        placeholder={element.placeholder}
        className="input"
        value={value}
        onChange={handleValueChange}
        min={element.min}
        max={element.max}
      />
    </div>
  );
};

export default TextFieldElement;