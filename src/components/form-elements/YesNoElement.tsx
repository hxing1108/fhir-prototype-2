import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { GripVertical, Trash2, HelpCircle } from 'lucide-react';

interface YesNoElementProps {
  element: IFormElement;
  dragHandleProps?: any; // For the entire element drag
  index?: string | number; // For displaying question number
  showNumbers?: boolean;
}

const YesNoElement: React.FC<YesNoElementProps> = ({ 
  element, 
  dragHandleProps, 
  index,
  showNumbers = false 
}) => {
  const { updateElement, selectedElementId, setSelectedElementId, removeElement, formSettings } = useFormContext();

  const handleLabelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleOptionLabelChange = (optionType: 'yesLabel' | 'noLabel', value: string) => {
    updateElement(element.id, { [optionType]: value });
  };

  const handleSelectionChange = (value: string) => {
    updateElement(element.id, { defaultValue: value });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  const uniqueId = (label: string) => `${element.id}-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const yesValue = element.yesLabel || 'Yes';
  const noValue = element.noLabel || 'No';

  const labelStyle = {
    fontSize: formSettings.fontSize,
    color: formSettings.textColor, // Assuming question label uses general text color
  };
  const optionLabelStyle = {
    fontSize: formSettings.fontSize, // Or a slightly smaller size if desired
    color: formSettings.textColor,
  };

  return (
    <div 
      className={`form-element group ${selectedElementId === element.id ? 'form-element-selected' : ''}`}
      onClick={handleClick}
      style={{ fontFamily: formSettings.fontFamily }}
    >
      <div className="flex items-center justify-between">
        {/* Container for drag handle, number, tooltip, label, AND Yes/No options */}
        <div className="flex items-center flex-1 min-w-0">
          {dragHandleProps && (
            <div {...dragHandleProps} className="cursor-move p-1 -ml-1 flex-shrink-0">
              <GripVertical size={16} className="text-gray-400" />
            </div>
          )}
          {/* Sub-container for number, tooltip, label (to allow label to grow) */}
          <div className="flex items-center gap-1 flex-grow min-w-0 mr-2">
            {showNumbers && index && (
              <span 
                className="text-sm font-medium text-gray-500 flex-shrink-0"
                style={{ fontSize: formSettings.fontSize, color: formSettings.textColor }}
              >
                {index}.
              </span>
            )}
            {element.showTooltip && (
              <div className="relative group/tooltip flex-shrink-0">
                <HelpCircle size={16} className="text-gray-400" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50">
                  {element.tooltipText || 'Tooltip text'}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
            <textarea
              name="label"
              value={element.label}
              onChange={handleLabelChange}
              className="editable-text min-w-0 flex-grow resize-none overflow-hidden"
              placeholder={element.placeholder || 'Enter your question...'}
              style={labelStyle}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            {element.required && (
              <span className="text-error-500 text-xs flex-shrink-0 ml-1">*</span>
            )}
          </div>

          {/* Yes/No Options - now part of this flex row */}
          <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
            <div className="flex items-center">
              <input 
                type="radio" 
                id={uniqueId(yesValue)}
                name={element.id} 
                value={yesValue}
                checked={element.defaultValue === yesValue}
                onChange={() => handleSelectionChange(yesValue)}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
              />
              <textarea
                value={yesValue}
                onChange={(e) => handleOptionLabelChange('yesLabel', e.target.value)}
                className="ml-2 editable-text text-sm resize-none overflow-hidden w-20"
                style={optionLabelStyle}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id={uniqueId(noValue)}
                name={element.id} 
                value={noValue}
                checked={element.defaultValue === noValue}
                onChange={() => handleSelectionChange(noValue)}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
              />
              <textarea
                value={noValue}
                onChange={(e) => handleOptionLabelChange('noLabel', e.target.value)}
                className="ml-2 editable-text text-sm resize-none overflow-hidden w-20"
                style={optionLabelStyle}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Delete Button (far right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeElement(element.id);
          }}
          className="p-1 text-gray-400 hover:text-error-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default YesNoElement; 