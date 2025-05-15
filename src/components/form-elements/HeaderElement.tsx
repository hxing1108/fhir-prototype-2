import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface HeaderElementProps {
  element: FormElement;
}

const HeaderElement: React.FC<HeaderElementProps> = ({ element }) => {
  const { updateElement, formSettings } = useFormContext();

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    updateElement(element.id, {
      header: { ...element.header!, align: alignment }
    });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateElement(element.id, {
      header: { ...element.header!, level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 }
    });
  };

  const style = {
    fontFamily: formSettings.fontFamily,
    color: formSettings.textColor,
    textAlign: element.header?.align || 'left',
  };

  const getHeaderSize = () => {
    switch (element.header?.level) {
      case 1: return 'text-4xl';
      case 2: return 'text-3xl';
      case 3: return 'text-2xl';
      case 4: return 'text-xl';
      case 5: return 'text-lg';
      case 6: return 'text-base';
      default: return 'text-2xl';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <select
          value={element.header?.level || 2}
          onChange={handleLevelChange}
          className="input w-32"
        >
          <option value={1}>Heading 1</option>
          <option value={2}>Heading 2</option>
          <option value={3}>Heading 3</option>
          <option value={4}>Heading 4</option>
          <option value={5}>Heading 5</option>
          <option value={6}>Heading 6</option>
        </select>

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

      <div 
        className={`${getHeaderSize()} font-semibold`}
        style={style}
      >
        <textarea
          value={element.label}
          onChange={(e) => updateElement(element.id, { label: e.target.value })}
          className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 resize-none"
          placeholder="Enter heading text..."
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      </div>
    </div>
  );
};

export default HeaderElement;