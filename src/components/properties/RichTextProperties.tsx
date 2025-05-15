import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface RichTextPropertiesProps {
  element: FormElement;
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

      <div>
        <label className="label">Description (Optional)</label>
        <textarea
          name="description"
          value={element.description || ''}
          onChange={handleChange}
          className="input"
          rows={2}
          placeholder="Add a description or instructions..."
        ></textarea>
      </div>
    </div>
  );
};

export default RichTextProperties;