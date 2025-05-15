import React from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface HeaderElementProps {
  element: FormElement;
}

const HeaderElement: React.FC<HeaderElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

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

  const textareaStyle = {
    textAlign: element.header?.align || 'left',
    color: element.header?.color,
    fontStyle: element.header?.italic ? 'italic' : 'normal',
    fontWeight: element.header?.bold ? 'bold' : 'normal',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  };

  return (
    <div className={`${getHeaderSize()}`}>
      <textarea
        value={element.label}
        onChange={(e) => updateElement(element.id, { label: e.target.value })}
        className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 resize-none overflow-hidden whitespace-pre-wrap break-words"
        placeholder="Enter heading text..."
        rows={1}
        style={textareaStyle}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
    </div>
  );
};

export default HeaderElement;