import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext';
import { IFormElement, VisibilitySettings } from '../../types/form';
import { ElementProperties } from './ElementProperties';
import { VisibilityPanel } from './visibility/VisibilityPanel';
import { PMSIntegrationPanel } from './pms-integration/PMSIntegrationPanel';
import FormProperties from '../properties/FormProperties';
import { v4 as uuidv4 } from 'uuid';

export interface PropertiesSidebarProps {}

export const PropertiesSidebar: React.FC<PropertiesSidebarProps> = () => {
  const { elements, selectedElementId, previewMode, updateElement } = useFormContext();
  const [savedContent, setSavedContent] = useState<Record<string, string>>({});
  const [savedDefaultTexts, setSavedDefaultTexts] = useState<Record<string, string>>({});
  const [linkId, setLinkId] = useState<string>('');

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

  // Initialize linkId when element is selected
  useEffect(() => {
    if (selectedElement) {
      const currentLinkId = selectedElement.linkId;
      if (currentLinkId) {
        setLinkId(currentLinkId);
      } else {
        // Generate and immediately save default linkId
        const defaultLinkId = generateDefaultLinkId();
        setLinkId(defaultLinkId);
        updateElement(selectedElement.id, { linkId: defaultLinkId });
      }
    } else {
      setLinkId('');
    }
  }, [selectedElement, updateElement]);

  // Generate a default linkId
  const generateDefaultLinkId = (): string => {
    return uuidv4();
  };

  // Handle linkId changes
  const handleLinkIdChange = (newLinkId: string) => {
    setLinkId(newLinkId);
    if (selectedElement) {
      updateElement(selectedElement.id, { linkId: newLinkId });
    }
  };

  const handleVariableSave = (elementId: string, content: string) => {
    if (elementId.includes('_default_')) {
      setSavedDefaultTexts((prev) => ({
        ...prev,
        [elementId]: content,
      }));
    } else {
      setSavedContent((prev) => ({
        ...prev,
        [elementId]: content,
      }));
    }
  };

  const handleVisibilityChange = (elementId: string, settings: VisibilitySettings) => {
    updateElement(elementId, { visibility: settings });
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
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="sidebar-title">Properties</h3>
        
        {/* LinkId Input */}
        <div className="mt-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form element name
          </label>
          <input
            type="text"
            value={linkId}
            onChange={(e) => handleLinkIdChange(e.target.value)}
            placeholder="fa310924-e32d-4b3d-8cb5-f97116691741"
            className="block w-full px-3 py-0.5 border border-[#D3D3D3] rounded-md shadow-sm focus:ring-2 focus:ring-[#2D2D85] focus:border-transparent transition duration-200 bg-white text-sm"
          />
        </div>
      </div>

      {/* Element Properties Section */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <ElementProperties selectedElement={selectedElement} />
        </div>
      </div>

      {/* Visibility Section */}
      <VisibilityPanel
        selectedElementId={selectedElement.id}
        visibilitySettings={selectedElement.visibility}
        onVisibilityChange={handleVisibilityChange}
      />

      {/* PMS Integration Section */}
      <PMSIntegrationPanel
        selectedElementId={selectedElement.id}
        onVariableSave={handleVariableSave}
        savedContent={savedContent}
        savedDefaultTexts={savedDefaultTexts}
      />
    </div>
  );
};
