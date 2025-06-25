import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { Switch } from '@headlessui/react';

interface TextAreaPropertiesProps {
  element: IFormElement;
}

const TextAreaProperties: React.FC<TextAreaPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' 
      ? (value === '' ? undefined : Number(value)) 
      : value;
    
    updateElement(element.id, { [name]: parsedValue });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateElement(element.id, { [name]: checked });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Label</label>
        <input
          type="text"
          name="label"
          value={element.label}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="label">Placeholder</label>
        <input
          type="text"
          name="placeholder"
          value={element.placeholder || ''}
          onChange={handleChange}
          className="input"
        />
      </div>



      <div className="flex items-center justify-between py-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block">
            Show tooltip for question
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Display a help icon with additional information
          </p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="showTooltip"
            checked={!!element.showTooltip}
            onChange={handleCheckboxChange}
          />
          <div className="toggle-switch-track">
            <div className="toggle-switch-thumb"></div>
          </div>
        </label>
      </div>

      {element.showTooltip && (
        <div>
          <label className="label">Tooltip Text</label>
          <textarea
            name="tooltipText"
            value={element.tooltipText || ''}
            onChange={handleChange}
            className="input"
            rows={2}
            placeholder="Enter tooltip text..."
          ></textarea>
        </div>
      )}

      <div className="flex items-center justify-between py-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block">
            Required field
          </label>
          <p className="text-xs text-gray-500 mt-1">
            This field must be filled out
          </p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="required"
            checked={!!element.required}
            onChange={handleCheckboxChange}
          />
          <div className="toggle-switch-track">
            <div className="toggle-switch-thumb"></div>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Min Length</label>
          <input
            type="number"
            name="minLength"
            value={element.minLength === undefined ? '' : element.minLength}
            onChange={handleChange}
            className="input"
            min={0}
          />
        </div>
        <div>
          <label className="label">Max Length</label>
          <input
            type="number"
            name="maxLength"
            value={element.maxLength === undefined ? '' : element.maxLength}
            onChange={handleChange}
            className="input"
            min={0}
          />
        </div>
      </div>
    </div>
  );
};

export default TextAreaProperties;