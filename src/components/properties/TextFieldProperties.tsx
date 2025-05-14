import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface TextFieldPropertiesProps {
  element: FormElement;
}

const TextFieldProperties: React.FC<TextFieldPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? (value ? Number(value) : undefined) : value;
    
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
        <textarea
          name="label"
          value={element.label}
          onChange={handleChange}
          className="input min-h-[60px] resize-y"
          placeholder="Enter label..."
        />
      </div>

      <div>
        <label className="label">Placeholder</label>
        <input
          type="text"
          name="placeholder"
          value={element.placeholder}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="label">Description (Optional)</label>
        <textarea
          name="description"
          value={element.description || ''}
          onChange={handleChange}
          className="input"
          rows={2}
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          name="required"
          checked={element.required}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-[#2D2D85] focus:ring-[#2D2D85] border-gray-300 rounded"
        />
        <label htmlFor="required" className="ml-2 text-sm text-gray-700">
          Required field
        </label>
      </div>

      {element.type === 'text' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Min Length</label>
              <input
                type="number"
                name="minLength"
                value={element.minLength || ''}
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
                value={element.maxLength || ''}
                onChange={handleChange}
                className="input"
                min={0}
              />
            </div>
          </div>
        </>
      )}

      {element.type === 'number' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Min Value</label>
            <input
              type="number"
              name="min"
              value={element.min || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Max Value</label>
            <input
              type="number"
              name="max"
              value={element.max || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      )}

      {element.type === 'email' && (
        <div>
          <p className="text-sm text-gray-500">
            Email fields automatically validate proper email format.
          </p>
        </div>
      )}
    </div>
  );
};

export default TextFieldProperties;