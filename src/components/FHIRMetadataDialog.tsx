import React, { useState, useRef, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';
import { useFormContext } from '../context/FormContext';
import { IFormElement } from '../types/form';

interface FHIRMetadataDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FHIRMetadataDialog: React.FC<FHIRMetadataDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    elements,
    selectedElementId,
    formMetadata,
    updateFormMetadata,
    updateElement,
  } = useFormContext();

  // State for dialog position
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Find the selected element
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

  // Handle changes to element FHIR properties
  const handleElementPropertyChange = (
    key: string,
    value: string | boolean | number | undefined
  ) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { [key]: value });
    }
  };

  // Drag functionality
  useEffect(() => {
    if (!isOpen || !headerRef.current || !dialogRef.current) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;

      const dialogRect = dialogRef.current?.getBoundingClientRect();
      if (dialogRect) {
        offsetX = e.clientX - dialogRect.left;
        offsetY = e.clientY - dialogRect.top;
      }

      // Prevent text selection during dragging
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newPosX = e.clientX - offsetX;
      const newPosY = e.clientY - offsetY;

      setPosition({
        x: Math.max(0, newPosX),
        y: Math.max(0, newPosY),
      });
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Add event listeners to the header for drag initiation
    headerRef.current.addEventListener('mousedown', handleMouseDown);

    // Add global event listeners for drag movement and release
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      headerRef.current?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen, headerRef, dialogRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed z-50 shadow-xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '600px',
        width: '100%',
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-auto"
        style={{ maxHeight: '80vh' }}
      >
        <div
          ref={headerRef}
          className="flex items-center justify-between border-b p-4 cursor-move bg-gray-50"
        >
          <div className="flex items-center">
            <GripVertical size={18} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">
              {selectedElement
                ? `FHIR Properties: ${
                    selectedElement.label || selectedElement.type
                  }`
                : 'Form FHIR Metadata'}
            </h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!selectedElement ? (
            // Form-level FHIR metadata
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formMetadata.title || ''}
                    onChange={(e) =>
                      updateFormMetadata({ title: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Questionnaire Title"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Human-readable name for the questionnaire
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formMetadata.status || 'draft'}
                    onChange={(e) =>
                      updateFormMetadata({
                        status: e.target.value as
                          | 'draft'
                          | 'active'
                          | 'retired'
                          | 'unknown',
                      })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="retired">Retired</option>
                    <option value="unknown">Unknown</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Publication status of the questionnaire
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={formMetadata.url || ''}
                  onChange={(e) => updateFormMetadata({ url: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="https://example.org/Questionnaire/example"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Canonical URL that uniquely identifies this questionnaire
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formMetadata.version || ''}
                    onChange={(e) =>
                      updateFormMetadata({ version: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="1.0.0"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Business version of the questionnaire
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formMetadata.date || ''}
                    onChange={(e) =>
                      updateFormMetadata({ date: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Date this version was published
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  value={formMetadata.publisher || ''}
                  onChange={(e) =>
                    updateFormMetadata({ publisher: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Organization Name"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Name of the publisher/steward
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formMetadata.description || ''}
                  onChange={(e) =>
                    updateFormMetadata({ description: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  rows={4}
                  placeholder="A description of the questionnaire..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Natural language description of the questionnaire
                </p>
              </div>
            </div>
          ) : (
            // Element-specific FHIR properties
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  linkId
                </label>
                <input
                  type="text"
                  value={selectedElement.linkId || ''}
                  onChange={(e) =>
                    handleElementPropertyChange('linkId', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder={selectedElement.id}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Unique identifier within the FHIR Questionnaire. If left
                  empty, the element ID will be used.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prefix
                </label>
                <input
                  type="text"
                  value={selectedElement.prefix || ''}
                  onChange={(e) =>
                    handleElementPropertyChange('prefix', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="e.g., 1., a), etc."
                />
                <p className="mt-1 text-xs text-gray-500">
                  A prefix to display before the question (e.g., numbering or
                  lettering).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Definition
                </label>
                <input
                  type="text"
                  value={selectedElement.definition || ''}
                  onChange={(e) =>
                    handleElementPropertyChange('definition', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="e.g., http://example.org/fhir/StructureDefinition/example#element"
                />
                <p className="mt-1 text-xs text-gray-500">
                  A formal definition for this item (e.g., a URL to a
                  StructureDefinition element).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedElement.readOnly || false}
                      onChange={(e) =>
                        handleElementPropertyChange(
                          'readOnly',
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Read Only
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 ml-6">
                    If true, indicates that the item cannot be changed.
                  </p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedElement.repeats || false}
                      onChange={(e) =>
                        handleElementPropertyChange('repeats', e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Repeats</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 ml-6">
                    If true, the item may appear multiple times in the
                    questionnaire.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  FHIR Type
                </label>
                <input
                  type="text"
                  value={selectedElement.fhirType || ''}
                  onChange={(e) =>
                    handleElementPropertyChange('fhirType', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="e.g., string, date, etc."
                />
                <p className="mt-1 text-xs text-gray-500">
                  The FHIR data type for this item.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer Value Set
                </label>
                <input
                  type="text"
                  value={selectedElement.answerValueSet || ''}
                  onChange={(e) =>
                    handleElementPropertyChange(
                      'answerValueSet',
                      e.target.value
                    )
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="e.g., http://example.org/fhir/ValueSet/example"
                />
                <p className="mt-1 text-xs text-gray-500">
                  A reference to a value set containing allowed answers for this
                  item.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Occurences
                </label>
                <input
                  type="number"
                  value={
                    selectedElement.maxOccurs === undefined
                      ? ''
                      : selectedElement.maxOccurs
                  }
                  onChange={(e) =>
                    handleElementPropertyChange(
                      'maxOccurs',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  min={0}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum repetitions for repeating items.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FHIRMetadataDialog;
