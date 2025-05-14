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
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
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
    addElement(type);
    setShowAddMenu(false);
  };

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Start Building Your Form</h3>
        <p className="text-gray-500 mb-6">Add elements from the sidebar or click the button below</p>
        <div className="relative inline-block" ref={menuRef}>
          <button 
            className="btn btn-primary inline-flex items-center"
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            <Plus size={16} className="mr-1" />
            <span>Add Your First Field</span>
            <ChevronDown size={16} className={`ml-2 transform transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showAddMenu && (
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
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
          <div className="relative inline-block" ref={menuRef}>
            <button 
              className="btn btn-sm btn-secondary inline-flex items-center gap-1"
              onClick={() => setShowAddMenu(!showAddMenu)}
            >
              <Plus size={16} />
              <span>Add Field</span>
              <ChevronDown size={16} className={`transform transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showAddMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
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
                    onClick={() => setShowAddMenu(false)}
                  >
                    {elements.length === 0 ? (
                      renderEmptyState()
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
                                style={provided.draggableProps.style}
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