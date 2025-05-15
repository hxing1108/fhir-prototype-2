import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface HeaderPropertiesProps {
  element: FormElement;
}

const HeaderProperties: React.FC<HeaderPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.value });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateElement(element.id, {
      header: { ...element.header!, level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Heading Text</label>
        <input
          type="text"
          name="label"
          value={element.label}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="label">Heading Level</label>
        <select
          value={element.header?.level || 2}
          onChange={handleLevelChange}
          className="input"
        >
          <option value={1}>Heading 1</option>
          <option value={2}>Heading 2</option>
          <option value={3}>Heading 3</option>
          <option value={4}>Heading 4</option>
          <option value={5}>Heading 5</option>
          <option value={6}>Heading 6</option>
        </select>
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
    </div>
  );
};

export default HeaderProperties;