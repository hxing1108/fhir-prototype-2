import React from 'react';
import { useFormContext } from '../context/FormContext';
import TextFieldProperties from './properties/TextFieldProperties';
import TextAreaProperties from './properties/TextAreaProperties';
import SelectProperties from './properties/SelectProperties';
import CheckboxProperties from './properties/CheckboxProperties';
import RadioProperties from './properties/RadioProperties';
import GroupProperties from './properties/GroupProperties';
import FormProperties from './properties/FormProperties';

const PropertiesSidebar: React.FC = () => {
  const { elements, selectedElementId, previewMode } = useFormContext();

  const findSelectedElement = (elements: FormElement[]): FormElement | undefined => {
    for (const element of elements) {
      if (element.id === selectedElementId) {
        return element;
      }
      if (element.elements) {
        const found = findSelectedElement(element.elements);
        if (found) return found;
      }
    }
    return undefined;
  };

  const selectedElement = findSelectedElement(elements);

  const renderPropertiesByType = () => {
    if (!selectedElement) {
      return <FormProperties />;
    }

    switch (selectedElement.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return <TextFieldProperties element={selectedElement} />;
      case 'textarea':
        return <TextAreaProperties element={selectedElement} />;
      case 'select':
        return <SelectProperties element={selectedElement} />;
      case 'checkbox':
        return <CheckboxProperties element={selectedElement} />;
      case 'radio':
        return <RadioProperties element={selectedElement} />;
      case 'group':
        return <GroupProperties element={selectedElement} />;
      default:
        return <div>Select an element to edit its properties</div>;
    }
  };

  if (previewMode) {
    return (
      <div className="h-full flex flex-col p-6">
        <h3 className="text-lg font-medium mb-4">Preview Mode</h3>
        <p className="text-gray-500">
          Exit preview mode to edit form elements.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="sidebar-title">Properties</h3>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {renderPropertiesByType()}
        </div>
      </div>
    </div>
  );
};

export default PropertiesSidebar;