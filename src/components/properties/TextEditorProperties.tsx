import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface TextEditorPropertiesProps {
  element: IFormElement;
}

const TextEditorProperties: React.FC<TextEditorPropertiesProps> = ({
  element,
}) => {
  const { updateElement } = useFormContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateElement(element.id, { [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateElement(element.id, { [name]: checked });
  };

  const handleTextEditorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateElement(element.id, {
      textEditor: {
        ...element.textEditor,
        [name]: value,
      },
    });
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

      <div>
        <label className="label">Editor Height</label>
        <select
          name="height"
          value={element.textEditor?.height || '200px'}
          onChange={handleTextEditorChange}
          className="input"
        >
          <option value="150px">Small (150px)</option>
          <option value="200px">Medium (200px)</option>
          <option value="300px">Large (300px)</option>
          <option value="400px">Extra Large (400px)</option>
        </select>
      </div>

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
    </div>
  );
};

export default TextEditorProperties;
