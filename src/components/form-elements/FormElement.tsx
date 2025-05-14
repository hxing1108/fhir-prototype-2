import React from 'react';
import { FormElement as FormElementType } from '../../types/form';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Trash2, GripVertical } from 'lucide-react';
import { useFormContext } from '../../context/FormContext';
import TextFieldElement from './TextFieldElement';
import TextAreaElement from './TextAreaElement';
import SelectElement from './SelectElement';
import CheckboxGroupElement from './CheckboxGroupElement';
import RadioGroupElement from './RadioGroupElement';
import GroupElement from './GroupElement';

interface FormElementProps {
  element: FormElementType;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  isNested?: boolean;
  index?: number;
  showNumbers?: boolean;
  groupTitleAsHeader?: boolean;
}

const FormElement: React.FC<FormElementProps> = ({ 
  element, 
  dragHandleProps, 
  isNested = false,
  index,
  showNumbers = false,
  groupTitleAsHeader = false
}) => {
  const { removeElement, selectedElementId, setSelectedElementId, updateElement, formSettings } = useFormContext();

  const renderElementByType = () => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return <TextFieldElement element={element} />;
      case 'textarea':
        return <TextAreaElement element={element} />;
      case 'select':
        return <SelectElement element={element} />;
      case 'checkbox':
        return <CheckboxGroupElement element={element} />;
      case 'radio':
        return <RadioGroupElement element={element} />;
      case 'group':
        return (
          <GroupElement 
            element={element} 
            dragHandleProps={dragHandleProps}
            isNested={isNested}
            showNumbers={showNumbers}
            groupTitleAsHeader={groupTitleAsHeader}
          />
        );
      default:
        return <div>Unknown element type</div>;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement(element.id, { label: e.target.value });
  };

  const handleRequiredChange = () => {
    updateElement(element.id, { required: !element.required });
  };

  if (element.type === 'group') {
    return renderElementByType();
  }

  const labelStyle = {
    fontSize: formSettings.fontSize
  };

  return (
    <div 
      className={`form-element group ${selectedElementId === element.id ? 'form-element-selected' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center flex-1 min-w-0">
          {!isNested && (
            <div {...dragHandleProps} className="cursor-move p-1 -ml-1 flex-shrink-0">
              <GripVertical size={16} className="text-gray-400" />
            </div>
          )}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {showNumbers && (
              <span className="text-sm font-medium text-gray-500 flex-shrink-0">
                {index}.
              </span>
            )}
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <textarea
                value={element.label}
                onChange={handleLabelChange}
                className="editable-text min-w-0 w-full resize-none overflow-hidden"
                placeholder="Enter label..."
                style={{
                  ...labelStyle,
                  height: 'auto',
                }}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
              {element.required && (
                <span className="text-error-500 text-xs flex-shrink-0">*</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeElement(element.id);
          }}
          className="p-1 text-gray-400 hover:text-error-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {renderElementByType()}
    </div>
  );
};

export default FormElement;