import React, { useState, useRef, useEffect } from 'react';
import { IFormElement, FormElementOption } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { Plus, Trash2, GripVertical, HelpCircle, MessageSquarePlus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Switch } from '@headlessui/react';

interface CheckboxPropertiesProps {
  element: IFormElement;
}

const CheckboxProperties: React.FC<CheckboxPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();
  const [newOption, setNewOption] = useState('');
  const [showEmptyTooltip, setShowEmptyTooltip] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-hide tooltip after 3 seconds
  useEffect(() => {
    if (showEmptyTooltip) {
      const timer = setTimeout(() => {
        setShowEmptyTooltip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showEmptyTooltip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.checked });
  };

  const handleOptionPropertyChange = (index: number, field: keyof FormElementOption, value: string | boolean) => {
    const newOptions = [...(element.options || [])];
    const updatedOption = { ...newOptions[index], [field]: value };
    newOptions[index] = updatedOption;
    updateElement(element.id, { options: newOptions });
  };

  const toggleOptionTooltip = (index: number) => {
    const newOptions = [...(element.options || [])];
    const oldOption = newOptions[index];
    const newShowState = !oldOption.showOptionTooltip;

    newOptions[index] = {
      ...oldOption,
      showOptionTooltip: newShowState,
      optionTooltipText: newShowState ? oldOption.optionTooltipText : '',
    };
    updateElement(element.id, { options: newOptions });
  };

  const handleAddOption = () => {
    if (!newOption.trim()) {
      setShowEmptyTooltip(true);
      return;
    }
    const newOptionObject: FormElementOption = {
      value: newOption,
      label: newOption,
      showOptionTooltip: false,
      optionTooltipText: ''
    };
    const newOptions = [...(element.options || []), newOptionObject];
    updateElement(element.id, { options: newOptions });
    setNewOption('');
    setShowEmptyTooltip(false);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...(element.options || [])];
    newOptions.splice(index, 1);
    updateElement(element.id, { options: newOptions });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !element.options) return;
    
    const items = Array.from(element.options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    updateElement(element.id, { options: items });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Label</label>
        <input
          type="text"
          name="label"
          value={element.label}
          onChange={handleChange}
          className="input"
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
        ></textarea>
      </div>

      <div className="flex items-center justify-between py-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block">
            Show tooltip for question
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Display a help icon with additional information for the entire question.
          </p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="showTooltip"
            checked={!!element.showTooltip}
            onChange={handleCheckboxChange}
          />
          <div className="toggle-switch-track">
            <div className="toggle-switch-thumb"></div>
          </div>
        </label>
      </div>

      {element.showTooltip && (
        <div>
          <label className="label">Tooltip Text (for question)</label>
          <textarea
            name="tooltipText"
            value={element.tooltipText || ''}
            onChange={handleChange}
            className="input"
            rows={2}
            placeholder="Enter tooltip text for the question..."
          ></textarea>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          name="required"
          checked={!!element.required}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="required" className="ml-2 text-sm text-gray-700">
          Required field
        </label>
      </div>

      <div className="flex items-center justify-between py-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block">
            Allow free text input
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Adds an "Other" option with a text field
          </p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="allowFreeText"
            checked={!!element.allowFreeText}
            onChange={handleCheckboxChange}
          />
          <div className="toggle-switch-track">
            <div className="toggle-switch-thumb"></div>
          </div>
        </label>
      </div>

      {element.allowFreeText && (
        <div>
          <label htmlFor="freeTextLabel" className="label">
            Label for free text option
          </label>
          <input
            type="text"
            id="freeTextLabel"
            name="freeTextLabel"
            value={element.freeTextLabel || 'Other:'}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Other:, Please specify:"
          />
        </div>
      )}

      <div>
        <label className="label">Options</label>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="options-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3 mb-3"
              >
                {element.options?.map((option, index) => (
                  <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                    {(providedDraggable) => (
                      <div
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        className="p-2 border border-gray-200 rounded-md bg-white shadow-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            {...providedDraggable.dragHandleProps}
                            className="cursor-move text-gray-400 p-1"
                          >
                            <GripVertical size={16} />
                          </div>
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => handleOptionPropertyChange(index, 'label', e.target.value)}
                            className="input input-sm flex-1"
                            placeholder="Option label"
                          />
                          <button
                            type="button"
                            onClick={() => toggleOptionTooltip(index)}
                            title={option.showOptionTooltip ? "Remove option tooltip" : "Add option tooltip"}
                            className={`p-1 rounded-md ${option.showOptionTooltip ? 'text-primary-500 bg-primary-100' : 'text-gray-400 hover:text-primary-500 hover:bg-gray-100'}`}
                          >
                            {option.showOptionTooltip ? <MessageSquarePlus size={16} /> : <HelpCircle size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-1 text-gray-400 hover:text-error-500"
                            title="Remove option"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {option.showOptionTooltip && (
                          <div className="mt-2 ml-8">
                            <label className="text-xs text-gray-600 mb-1 block">Tooltip for "{option.label}"</label>
                            <textarea
                              value={option.optionTooltipText || ''}
                              onChange={(e) => handleOptionPropertyChange(index, 'optionTooltipText', e.target.value)}
                              className="input input-sm w-full"
                              placeholder="Enter tooltip text for this option..."
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <div className="flex mt-2 relative">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            className="input flex-1 mr-2"
            placeholder="Add new option"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddOption();
              }
            }}
            onFocus={() => setShowEmptyTooltip(false)}
          />
          <button
            ref={addButtonRef}
            type="button"
            onClick={handleAddOption}
            className="btn btn-sm btn-secondary relative"
          >
            <Plus size={16} />
          </button>
          
          {/* Empty option tooltip */}
          {showEmptyTooltip && (
            <div className="absolute bottom-full mb-2 right-0 z-50">
              <div className="bg-red-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Please enter text first
                <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-red-500"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckboxProperties;