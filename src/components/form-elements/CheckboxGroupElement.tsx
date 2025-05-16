import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface CheckboxGroupElementProps {
  element: IFormElement;
}

const CheckboxGroupElement: React.FC<CheckboxGroupElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleOptionLabelChange = (index: number, newLabel: string) => {
    const newOptions = [...(element.options || [])];
    newOptions[index] = { ...newOptions[index], label: newLabel, value: newLabel };
    updateElement(element.id, { options: newOptions });
  };

  const handleFreeTextLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement(element.id, { freeTextLabel: e.target.value });
  };

  return (
    <div>
      <div className="space-y-2 mt-1">
        {element.options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`${element.id}-${index}-editor`}
              name={`${element.id}-editor`}
              value={option.value}
              disabled
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <input
              type="text"
              value={option.label}
              onChange={(e) => handleOptionLabelChange(index, e.target.value)}
              className="ml-2 text-sm text-gray-700 editable-text flex-1"
              placeholder="Enter option label..."
            />
          </div>
        ))}
        {element.allowFreeText && (
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id={`${element.id}-freetext-editor-checkbox`}
              disabled
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <input
              type="text"
              value={element.freeTextLabel || 'Other:'}
              onChange={handleFreeTextLabelChange}
              className="ml-2 text-sm text-gray-700 editable-text flex-1"
              placeholder="Label for free text option"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxGroupElement;