import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface TextAreaElementProps {
  element: FormElement;
}

const TextAreaElement: React.FC<TextAreaElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  return (
    <div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      <textarea
        placeholder={element.placeholder}
        className="input"
        disabled
        rows={3}
      ></textarea>
    </div>
  );
};

export default TextAreaElement;