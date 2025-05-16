import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { Switch } from '@headlessui/react';

interface GroupPropertiesProps {
  element: IFormElement;
}

const GroupProperties: React.FC<GroupPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.checked });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Group Label</label>
        <input
          type="text"
          name="label"
          value={element.label || ''}
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
    </div>
  );
};

export default GroupProperties;