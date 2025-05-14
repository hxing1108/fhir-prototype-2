import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface CheckboxGroupElementProps {
  element: FormElement;
}

const CheckboxGroupElement: React.FC<CheckboxGroupElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  return (
    <div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      <div className="space-y-2 mt-1">
        {element.options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`${element.id}-${index}`}
              name={element.id}
              value={option.value}
              disabled
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
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

export default CheckboxGroupElement;