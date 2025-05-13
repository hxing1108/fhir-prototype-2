import React, { useState, useRef, useEffect } from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface RadioGroupElementProps {
  element: FormElement;
}

const RadioGroupElement: React.FC<RadioGroupElementProps> = ({ element }) => {
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
          <div className="label cursor-text" onClick={handleLabelClick}>
            {element.label}
            {element.required && <span className="text-error-500 ml-1">*</span>}
          </div>
        )}
      </div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      <div className="space-y-2 mt-1">
        {element.options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`${element.id}-${index}`}
              name={element.id}
              value={option.value}
              disabled
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
            />
            <label
              htmlFor={`${element.id}-${index}`}
              className="ml-2 text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioGroupElement;