import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { HelpCircle } from 'lucide-react';

interface CheckboxGroupElementProps {
  element: IFormElement;
}

const CheckboxGroupElement: React.FC<CheckboxGroupElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const handleOptionLabelChange = (index: number, newLabel: string) => {
    const newOptions = [...(element.options || [])];
    newOptions[index] = { 
      ...newOptions[index], 
      label: newLabel, 
    };
    updateElement(element.id, { options: newOptions });
  };

  const handleFreeTextLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement(element.id, { freeTextLabel: e.target.value });
  };

  return (
    <div>
      <div className="space-y-2 mt-1">
        {element.options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`${element.id}-${index}-editor`}
              name={`${element.id}-editor`}
              value={option.value}
              disabled
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            {option.showOptionTooltip && option.optionTooltipText && (
              <div className="relative group/tooltip flex-shrink-0 ml-1.5 mr-0.5">
                <HelpCircle size={14} className="text-gray-400" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50 min-w-max max-w-xs">
                  {option.optionTooltipText}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
            <input
              type="text"
              value={option.label}
              onChange={(e) => handleOptionLabelChange(index, e.target.value)}
              className="ml-1 text-sm text-gray-700 editable-text flex-1"
              placeholder="Enter option label..."
            />
          </div>
        ))}
        {element.allowFreeText && (
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id={`${element.id}-freetext-editor-checkbox`}
              disabled
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <input
              type="text"
              value={element.freeTextLabel || 'Other:'}
              onChange={handleFreeTextLabelChange}
              className="ml-2 text-sm text-gray-700 editable-text flex-1"
              placeholder="Label for free text option"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxGroupElement;