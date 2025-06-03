import React, { useState } from 'react';
import { useFormContext } from '../context/FormContext';
import { IFormElement } from '../types/form';
import TextFieldProperties from './properties/TextFieldProperties';
import TextAreaProperties from './properties/TextAreaProperties';
import SelectProperties from './properties/SelectProperties';
import CheckboxProperties from './properties/CheckboxProperties';
import RadioProperties from './properties/RadioProperties';
import GroupProperties from './properties/GroupProperties';
import FormProperties from './properties/FormProperties';
import HeaderProperties from './properties/HeaderProperties';
import ImageProperties from './properties/ImageProperties';
import YesNoProperties from './properties/YesNoProperties';
import FHIRMetadataDialog from './FHIRMetadataDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const PropertiesSidebar: React.FC = () => {
  const {
    elements,
    selectedElementId,
    previewMode,
    updateElement,
    formMetadata,
    updateFormMetadata,
  } = useFormContext();

  const [showAcrofeldDialog, setShowAcrofeldDialog] = useState(false);

  const findSelectedElement = (
    els: IFormElement[]
  ): IFormElement | undefined => {
    for (const element of els) {
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
      case 'header':
        return <HeaderProperties element={selectedElement} />;
      case 'image':
        return <ImageProperties element={selectedElement} />;
      case 'yesNo':
        return <YesNoProperties element={selectedElement} />;
      default:
        return <div>Select an element to edit its properties</div>;
    }
  };

  const handleOpenAcrofeldDialog = () => {
    if (selectedElement) {
      setShowAcrofeldDialog(true);
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

  if (!selectedElement) {
    return (
      <div className="bg-white p-4 rounded-lg shadow overflow-auto h-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Form Settings
        </h2>
        <FormProperties />
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="sidebar-title">Properties</h3>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4">{renderPropertiesByType()}</div>
        </div>

        {/* Add Acrofeld Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleOpenAcrofeldDialog}
            disabled={!selectedElement}
            className={`btn btn-secondary flex items-center justify-center w-full ${
              !selectedElement ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Add Acrofeld Configuration"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-info mr-2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            Add Acrofeld
          </button>
          {!selectedElement && (
            <p className="mt-2 text-xs text-gray-500 text-center">
              Select an element to configure Acrofeld settings
            </p>
          )}
        </div>
      </div>

      {/* Acrofeld Dialog */}
      <FHIRMetadataDialog
        isOpen={showAcrofeldDialog}
        onClose={() => setShowAcrofeldDialog(false)}
        initialTab="acrofield"
      />
    </>
  );
};

export default PropertiesSidebar;
