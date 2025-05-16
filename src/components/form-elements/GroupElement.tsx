import React, { useState, useRef, useEffect } from 'react';
import { IFormElement, FormElementType } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { ChevronDown, Type, AlignLeft, Hash, Mail, List, CheckSquare, Circle, CalendarDays, GripVertical, Trash2, HelpCircle } from 'lucide-react';
import FormElementComponent from './FormElement';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface GroupElementProps {
  element: IFormElement;
  dragHandleProps?: any;
  isNested?: boolean;
  showNumbers?: boolean;
  groupTitleAsHeader?: boolean;
}

const GroupElement: React.FC<GroupElementProps> = ({ 
  element, 
  dragHandleProps, 
  isNested = false,
  showNumbers = false,
  groupTitleAsHeader = false
}) => {
  const { updateElement, addElement, selectedElementId, setSelectedElementId, removeElement } = useFormContext();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const elementTypes = [
    { type: 'text' as FormElementType, icon: <Type size={16} />, label: 'Text Field' },
    { type: 'textarea' as FormElementType, icon: <AlignLeft size={16} />, label: 'Text Area' },
    { type: 'number' as FormElementType, icon: <Hash size={16} />, label: 'Number' },
    { type: 'email' as FormElementType, icon: <Mail size={16} />, label: 'Email' },
    { type: 'select' as FormElementType, icon: <List size={16} />, label: 'Dropdown' },
    { type: 'checkbox' as FormElementType, icon: <CheckSquare size={16} />, label: 'Checkbox Group' },
    { type: 'radio' as FormElementType, icon: <Circle size={16} />, label: 'Radio Group' },
    { type: 'date' as FormElementType, icon: <CalendarDays size={16} />, label: 'Date' },
  ];

  const handleAddElement = (type: FormElementType) => {
    addElement(type, element.id);
    setShowAddMenu(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement(element.id, { label: e.target.value });
  };

  if (!groupTitleAsHeader) {
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
            <div className="flex items-center gap-2">
              {element.showTooltip && (
                <div className="relative group/tooltip">
                  <HelpCircle size={16} className="text-gray-400" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50">
                    {element.tooltipText || 'Tooltip text'}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
              <textarea
                value={element.label}
                onChange={handleLabelChange}
                className="text-sm font-medium editable-text min-w-0 w-full resize-none overflow-hidden"
                placeholder="Enter label..."
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddMenu(!showAddMenu);
                }}
                className="btn btn-sm btn-secondary flex items-center gap-1"
              >
                Add Field
                <ChevronDown size={16} className={`transform transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showAddMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                  {elementTypes.map((type) => (
                    <button
                      key={type.type}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddElement(type.type);
                      }}
                    >
                      {type.icon}
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
              className="p-1 text-gray-400 hover:text-error-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {element.description && (
          <p className="text-sm text-gray-500">{element.description}</p>
        )}

        <Droppable droppableId={element.id} type="group-items">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`pl-4 border-l-2 border-gray-200 space-y-4 mt-4 min-h-[50px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
            >
              {element.elements?.map((childElement, index) => (
                <Draggable key={childElement.id} draggableId={childElement.id} index={index}>
                  {(providedDraggable) => (
                    <div
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                    >
                      <FormElementComponent
                        element={childElement}
                        isNested={true}
                        index={showNumbers ? index + 1 : undefined}
                        showNumbers={showNumbers}
                        groupTitleAsHeader={groupTitleAsHeader}
                        dragHandleProps={providedDraggable.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }

  return (
    <div 
      className={`form-element group ${selectedElementId === element.id ? 'form-element-selected' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center flex-1 min-w-0">
          {!isNested && (
            <div {...dragHandleProps} className="cursor-move p-1 -ml-1 flex-shrink-0">
              <GripVertical size={16} className="text-gray-400" />
            </div>
          )}
          <div className="flex items-center gap-2">
            {element.showTooltip && (
              <div className="relative group/tooltip">
                <HelpCircle size={16} className="text-gray-400" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50">
                  {element.tooltipText || 'Tooltip text'}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
            <h3 className="text-xl font-semibold flex-1 min-w-0">
              <textarea
                value={element.label}
                onChange={handleLabelChange}
                className="editable-text min-w-0 w-full resize-none overflow-hidden"
                placeholder="Enter group title..."
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddMenu(!showAddMenu);
              }}
              className="btn btn-sm btn-secondary flex items-center gap-1"
            >
              Add Field
              <ChevronDown size={16} className={`transform transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showAddMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                {elementTypes.map((type) => (
                  <button
                    key={type.type}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddElement(type.type);
                    }}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
            className="p-1 text-gray-400 hover:text-error-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {element.description && (
        <p className="text-sm text-gray-500">{element.description}</p>
      )}

      <Droppable droppableId={element.id} type="group-items">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`pl-4 border-l-2 border-gray-200 space-y-4 mt-4 min-h-[50px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
          >
            {element.elements?.map((childElement, index) => (
              <Draggable key={childElement.id} draggableId={childElement.id} index={index}>
                {(providedDraggable) => (
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                  >
                    <FormElementComponent
                      element={childElement}
                      isNested={true}
                      index={showNumbers ? index + 1 : undefined}
                      showNumbers={showNumbers}
                      groupTitleAsHeader={groupTitleAsHeader}
                      dragHandleProps={providedDraggable.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default GroupElement;