import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface SelectElementProps {
  element: IFormElement;
}

const SelectElement: React.FC<SelectElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleOptionLabelChange = (index: number, newLabel: string) => {
    const newOptions = [...(element.options || [])];
    newOptions[index] = { ...newOptions[index], label: newLabel, value: newLabel };
    updateElement(element.id, { options: newOptions });
  };

  return (
    <div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      <div className="space-y-2 mt-1">
        {element.options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              value={option.label}
              onChange={(e) => handleOptionLabelChange(index, e.target.value)}
              className="text-sm text-gray-700 editable-text"
              placeholder="Enter option label..."
            />
          </div>
        ))}
      </div>
      <select className="input mt-2" disabled>
        <option value="" disabled>
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