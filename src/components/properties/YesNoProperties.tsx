import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface YesNoPropertiesProps {
  element: IFormElement;
}

const YesNoProperties: React.FC<YesNoPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateElement(element.id, { [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateElement(element.id, { [name]: checked });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Question Label</label>
        <input
          type="text"
          name="label"
          value={element.label || ''}
          onChange={handleChange}
          className="input"
          placeholder="Enter your question..."
        />
      </div>

      <div>
        <label className="label">'Yes' Option Label</label>
        <input
          type="text"
          name="yesLabel"
          value={element.yesLabel || ''} 
          onChange={handleChange}
          className="input"
          placeholder="Yes"
        />
      </div>

      <div>
        <label className="label">'No' Option Label</label>
        <input
          type="text"
          name="noLabel"
          value={element.noLabel || ''} 
          onChange={handleChange}
          className="input"
          placeholder="No"
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

      <div className="flex items-center justify-between py-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block">
            Show Tooltip
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

      <div className="flex items-center">
        <input
          type="checkbox"
          id="required-yesno"
          name="required"
          checked={!!element.required}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="required-yesno" className="ml-2 text-sm text-gray-700">
          Required field
        </label>
      </div>
    </div>
  );
};

export default YesNoProperties; 