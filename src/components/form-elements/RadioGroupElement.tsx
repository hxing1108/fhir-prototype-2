import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface RadioGroupElementProps {
  element: FormElement;
}

const RadioGroupElement: React.FC<RadioGroupElementProps> = ({ element }) => {
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
              type="radio"
              id={`${element.id}-${index}`}
              name={element.id}
              value={option.value}
              disabled
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
            />
            <input
              type="text"
              value={option.label}
              onChange={(e) => handleOptionLabelChange(index, e.target.value)}
              className="ml-2 text-sm text-gray-700 editable-text"
              placeholder="Enter option label..."
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioGroupElement;