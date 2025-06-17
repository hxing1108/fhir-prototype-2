import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { IFormElement } from '../../types/form';
import { ElementProperties } from './ElementProperties';
import { PMSIntegrationPanel } from './pms-integration/PMSIntegrationPanel';
import FormProperties from '../properties/FormProperties';

export interface PropertiesSidebarProps {}

export const PropertiesSidebar: React.FC<PropertiesSidebarProps> = () => {
  const { elements, selectedElementId, previewMode } = useFormContext();
  const [savedContent, setSavedContent] = useState<Record<string, string>>({});

  // Find the selected element recursively
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

  const handleVariableSave = (elementId: string, content: string) => {
    setSavedContent((prev) => ({
      ...prev,
      [elementId]: content,
    }));
  };

  // Preview mode view
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

  // No element selected - show form properties
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

  // Element selected - show element properties and integration sections
  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="sidebar-title">Properties</h3>
      </div>

      {/* Element Properties Section */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <ElementProperties selectedElement={selectedElement} />
        </div>
      </div>

      {/* PMS Integration Section */}
      <PMSIntegrationPanel
        selectedElementId={selectedElement.id}
        onVariableSave={handleVariableSave}
        savedContent={savedContent}
      />
    </div>
  );
};
