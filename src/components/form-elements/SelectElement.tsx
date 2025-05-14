import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface SelectElementProps {
  element: FormElement;
}

const SelectElement: React.FC<SelectElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  return (
    <div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      <select className="input" disabled>
        <option value="" disabled selected>
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