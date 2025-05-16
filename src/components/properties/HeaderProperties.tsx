import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

interface HeaderPropertiesProps {
  element: IFormElement;
}

const HeaderProperties: React.FC<HeaderPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.value });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateElement(element.id, {
      header: { ...(element.header || { level: 2, align: 'left' }), level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 }
    });
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    updateElement(element.id, {
      header: { ...(element.header || { level: 2, align: 'left' }), align: alignment }
    });
  };

  const handleColorChange = (color: string) => {
    updateElement(element.id, {
      header: { ...(element.header || { level: 2, align: 'left' }), color }
    });
  };

  const toggleStyle = (style: 'bold' | 'italic') => {
    updateElement(element.id, {
      header: { 
        ...(element.header || { level: 2, align: 'left' }), 
        [style]: !element.header?.[style]
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Heading Text</label>
        <input
          type="text"
          name="label"
          value={element.label || ''}
          onChange={handleChange}
          className="input"
          placeholder="Enter heading text..."
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
        <label className="label">Text Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.header?.color || '#000000'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-8 w-8 rounded border border-gray-300"
          />
          <input
            type="text"
            value={element.header?.color || '#000000'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="input flex-1"
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <label className="label">Text Style</label>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md">
          <button
            type="button"
            onClick={() => toggleStyle('bold')}
            className={`p-2 ${element.header?.bold ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => toggleStyle('italic')}
            className={`p-2 ${element.header?.italic ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <Italic size={16} />
          </button>
        </div>
      </div>

      <div>
        <label className="label">Text Alignment</label>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md">
          <button
            type="button"
            onClick={() => handleAlignmentChange('left')}
            className={`p-2 ${element.header?.align === 'left' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleAlignmentChange('center')}
            className={`p-2 ${element.header?.align === 'center' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleAlignmentChange('right')}
            className={`p-2 ${element.header?.align === 'right' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignRight size={16} />
          </button>
        </div>
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