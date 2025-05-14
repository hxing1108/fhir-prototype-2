import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface TextFieldElementProps {
  element: FormElement;
}

const TextFieldElement: React.FC<TextFieldElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const getInputType = () => {
    switch (element.type) {
      case 'email':
        return 'email';
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  };

  return (
    <div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      <input
        type={getInputType()}
        placeholder={element.placeholder}
        className="input"
        disabled
        min={element.min}
        max={element.max}
      />
    </div>
  );
};

export default TextFieldElement;