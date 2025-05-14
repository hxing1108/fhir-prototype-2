import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useFormContext } from '../context/FormContext';
import FormElement from './form-elements/FormElement';
import FormElementPreview from './form-elements/FormElementPreview';
import { Plus, Type, AlignLeft, Hash, Mail, List, CheckSquare, Circle, CalendarDays, FolderPlus, ChevronDown } from 'lucide-react';
import { FormElementType } from '../types/form';

const FormBuilder: React.FC = () => {
  const { 
    elements, 
    selectedElementId, 
    setSelectedElementId, 
    moveElement,
    previewMode,
    addElement
  } = useFormContext();

  const [showHeaderAddMenu, setShowHeaderAddMenu] = React.useState(false);
  const [showEmptyStateAddMenu, setShowEmptyStateAddMenu] = React.useState(false);
  const headerMenuRef = React.useRef<HTMLDivElement>(null);
  const emptyStateMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setShowHeaderAddMenu(false);
      }
      if (emptyStateMenuRef.current && !emptyStateMenuRef.current.contains(event.target as Node)) {
        setShowEmptyStateAddMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    moveElement(sourceIndex, destinationIndex);
  };

  const elementTypes = [
    { type: 'text' as FormElementType, icon: <Type size={16} />, label: 'Text Field' },
    { type: 'textarea' as FormElementType, icon: <AlignLeft size={16} />, label: 'Text Area' },
    { type: 'number' as FormElementType, icon: <Hash size={16} />, label: 'Number' },
    { type: 'email' as FormElementType, icon: <Mail size={16} />, label: 'Email' },
    { type: 'select' as FormElementType, icon: <List size={16} />, label: 'Dropdown' },
    { type: 'checkbox' as FormElementType, icon: <CheckSquare size={16} />, label: 'Checkbox Group' },
    { type: 'radio' as FormElementType, icon: <Circle size={16} />, label: 'Radio Group' },
    { type: 'date' as FormElementType, icon: <CalendarDays size={16} />, label: 'Date' },
    { type: 'group' as FormElementType, icon: <FolderPlus size={16} />, label: 'Question Group' },
  ];

  const handleAddElement = (type: FormElementType) => {
    const selectedGroup = findSelectedGroup(elements);
    addElement(type, selectedGroup?.id);
    setShowHeaderAddMenu(false);
    setShowEmptyStateAddMenu(false);
  };

  const findSelectedGroup = (elements: FormElement[]): FormElement | null => {
    for (const element of elements) {
      if (element.id === selectedElementId && element.type === 'group') {
        return element;
      }
      if (element.elements) {
        const found = findSelectedGroup(element.elements);
        if (found) return found;
      }
    }
    return null;
  };

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Start Building Your Form</h3>
        <p className="text-gray-500 mb-6">Add elements from the sidebar or click the button below</p>
        <div className="relative inline-block" ref={emptyStateMenuRef}>
          <button 
            className="btn btn-primary inline-flex items-center gap-2"
            onClick={() => setShowEmptyStateAddMenu(!showEmptyStateAddMenu)}
          >
            <Plus size={16} />
            Add Your First Field
            <ChevronDown size={16} className={`transform transition-transform ${showEmptyStateAddMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showEmptyStateAddMenu && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              {elementTypes.map((type) => (
                <button
                  key={type.type}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => handleAddElement(type.type)}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {previewMode ? 'Form Preview' : 'Form Builder'}
        </h2>
        {!previewMode && (
          <div className="relative inline-block" ref={headerMenuRef}>
            <button 
              className="btn btn-sm btn-secondary inline-flex items-center gap-2"
              onClick={() => setShowHeaderAddMenu(!showHeaderAddMenu)}
            >
              <Plus size={16} />
              Add Field
              <ChevronDown size={16} className={`transform transition-transform ${showHeaderAddMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showHeaderAddMenu && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                {elementTypes.map((type) => (
                  <button
                    key={type.type}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => handleAddElement(type.type)}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {previewMode ? (
            <div className="p-6">
              <form onSubmit={(e) => e.preventDefault()}>
                {elements.map((element) => (
                  <div key={element.id} className="mb-6">
                    <FormElementPreview element={element} />
                  </div>
                ))}
                <div className="mt-8">
                  <button 
                    type="submit"
                    className="btn btn-primary inline-flex items-center"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-builder">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-6 min-h-[400px] ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                  >
                    {elements.length === 0 ? (
                      <>
                        {renderEmptyState()}
                        {provided.placeholder}
                      </>
                    ) : (
                      <>
                        {elements.map((element, index) => (
                          <Draggable 
                            key={element.id} 
                            draggableId={element.id} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`mb-4 ${snapshot.isDragging ? 'element-dragging' : ''}`}
                              >
                                <FormElement 
                                  element={element} 
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;