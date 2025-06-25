import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface RichTextPropertiesProps {
  element: IFormElement;
}

const RichTextProperties: React.FC<RichTextPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Label (Optional)</label>
        <input
          type="text"
          name="label"
          value={element.label}
          onChange={handleChange}
          className="input"
          placeholder="Enter a label for this text block..."
        />
      </div>


    </div>
  );
};

export default RichTextProperties;