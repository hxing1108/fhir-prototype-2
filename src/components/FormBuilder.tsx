import React, { useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useFormContext } from '../context/FormContext';
import FormElement from './form-elements/FormElement';
import FormElementPreview from './form-elements/FormElementPreview';
import { Plus, Type, AlignLeft, Hash, Mail, List, CheckSquare, Circle, CalendarDays, FolderPlus, ChevronDown, Heading } from 'lucide-react';
import { FormElementType, IFormElement } from '../types/form';

const FormBuilder: React.FC = () => {
  const { 
    elements, 
    selectedElementId, 
    setSelectedElementId, 
    moveElement,
    moveElementInGroup,
    previewMode,
    addElement,
    formSettings
  } = useFormContext();
  console.log('previewMode:', previewMode);

  const [showHeaderAddMenu, setShowHeaderAddMenu] = React.useState(false);
  const [showEmptyStateAddMenu, setShowEmptyStateAddMenu] = React.useState(false);
  const headerMenuRef = React.useRef<HTMLDivElement>(null);
  const emptyStateMenuRef = React.useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [lastAddedElementId, setLastAddedElementId] = React.useState<string | null>(null);

  // Auto-scroll to newly added elements
  useEffect(() => {
    if (selectedElementId && selectedElementId !== lastAddedElementId && !previewMode) {
      // Use setTimeout to ensure the DOM has updated
      const timer = setTimeout(() => {
        const elementToScroll = document.querySelector(`[data-element-id="${selectedElementId}"]`);
        if (elementToScroll && formContainerRef.current) {
          // Get the form container's scroll parent (usually the main content area)
          let scrollContainer = formContainerRef.current.parentElement;
          while (scrollContainer && scrollContainer.scrollHeight === scrollContainer.clientHeight) {
            scrollContainer = scrollContainer.parentElement;
          }
          
          if (scrollContainer) {
            const elementRect = elementToScroll.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            
            // Calculate the scroll position to center the element in view
            const scrollTop = scrollContainer.scrollTop + 
                             elementRect.top - 
                             containerRect.top - 
                             (containerRect.height / 2) + 
                             (elementRect.height / 2);
            
            // Smooth scroll to the element
            scrollContainer.scrollTo({
              top: Math.max(0, scrollTop),
              behavior: 'smooth'
            });
          }
        }
        setLastAddedElementId(selectedElementId);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedElementId, previewMode, lastAddedElementId]);

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
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'form-builder') {
        moveElement(source.index, destination.index);
      } else {
        moveElementInGroup(source.droppableId, source.index, destination.index);
      }
    } else {
      console.log('Moving between different lists is not yet implemented.', result);
    }
  };

  const elementTypes = [
    { type: 'header' as FormElementType, icon: <Heading size={16} />, label: 'Header' },
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

  const findSelectedGroup = (elements: IFormElement[]): IFormElement | null => {
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

  const handleFormBodyClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
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
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
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

  const formStyle = {
    backgroundColor: formSettings.backgroundColor,
    color: formSettings.textColor,
    fontFamily: formSettings.fontFamily,
    fontSize: formSettings.fontSize,
  };

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
        <div 
          ref={formContainerRef}
          className="bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          {previewMode ? (
            <div className="p-6" style={formStyle}>
              <form onSubmit={(e) => e.preventDefault()}>
                {elements.map((element, index) => (
                  <div key={element.id} className="mb-6" data-element-id={element.id}>
                    <FormElementPreview 
                      element={element} 
                      index={index + 1} 
                      showNumbers={formSettings.showQuestionNumbers}
                      groupTitleAsHeader={formSettings.groupTitleAsHeader}
                    />
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
                    className={`p-6 min-h-[400px] ${snapshot.isDraggingOver ? 'bg-gray-50' : ''} ${selectedElementId === null ? 'ring-2 ring-primary-200' : ''}`}
                    style={formStyle}
                    onClick={handleFormBodyClick}
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
                                data-element-id={element.id}
                              >
                                <FormElement 
                                  element={element} 
                                  dragHandleProps={provided.dragHandleProps}
                                  index={index + 1}
                                  showNumbers={formSettings.showQuestionNumbers}
                                  groupTitleAsHeader={formSettings.groupTitleAsHeader}
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

export default FormBuilder