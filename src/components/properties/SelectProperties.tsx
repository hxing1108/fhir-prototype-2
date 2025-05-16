import React, { useState } from 'react';
import { IFormElement, FormElementOption } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface SelectPropertiesProps {
  element: IFormElement;
}

const SelectProperties: React.FC<SelectPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();
  const [newOption, setNewOption] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.checked });
  };

  const handleOptionChange = (index: number, field: keyof FormElementOption, value: string) => {
    const newOptions = [...(element.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    updateElement(element.id, { options: newOptions });
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const newOptions = [...(element.options || []), { value: newOption, label: newOption }];
    updateElement(element.id, { options: newOptions });
    setNewOption('');
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
        <label className="label">Placeholder</label>
        <input
          type="text"
          name="placeholder"
          value={element.placeholder || ''}
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
            Show Tooltip
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Display a help icon with additional information
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
          <label className="label">Tooltip Text</label>
          <textarea
            name="tooltipText"
            value={element.tooltipText || ''}
            onChange={handleChange}
            className="input"
            rows={2}
            placeholder="Enter tooltip text..."
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

      <div>
        <label className="label">Options</label>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="options-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 mb-3"
              >
                {element.options?.map((option, index) => (
                  <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center space-x-2"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-move text-gray-400"
                        >
                          <GripVertical size={16} />
                        </div>
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                          className="input flex-1"
                          placeholder="Option label"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="p-1 text-gray-400 hover:text-error-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <div className="flex mt-2">
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
          />
          <button
            type="button"
            onClick={handleAddOption}
            className="btn btn-sm btn-secondary"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectProperties;