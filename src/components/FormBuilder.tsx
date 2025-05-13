import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useFormContext } from '../context/FormContext';
import FormElement from './form-elements/FormElement';
import FormElementPreview from './form-elements/FormElementPreview';
import { Plus } from 'lucide-react';

const FormBuilder: React.FC = () => {
  const { 
    elements, 
    selectedElementId, 
    setSelectedElementId, 
    moveElement,
    previewMode,
    addElement
  } = useFormContext();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    moveElement(sourceIndex, destinationIndex);
  };

  const handleQuickAdd = () => {
    // Find the selected group element if any
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

    const selectedGroup = findSelectedGroup(elements);
    addElement('text', selectedGroup?.id);
  };

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Start Building Your Form</h3>
        <p className="text-gray-500 mb-6">Add elements from the sidebar or click the button below</p>
        <button 
          className="btn btn-primary inline-flex items-center"
          onClick={handleQuickAdd}
        >
          <Plus size={16} className="mr-1" />
          <span>Add Your First Field</span>
        </button>
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
          <button 
            className="btn btn-sm btn-secondary inline-flex items-center"
            onClick={handleQuickAdd}
          >
            <Plus size={16} className="mr-1" />
            <span>Add Field</span>
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {previewMode ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
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
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <Droppable droppableId="form-builder">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-6 min-h-[400px] ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
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
                                style={{
                                  ...provided.draggableProps.style,
                                  cursor: snapshot.isDragging ? 'grabbing' : 'default'
                                }}
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
                      </>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;