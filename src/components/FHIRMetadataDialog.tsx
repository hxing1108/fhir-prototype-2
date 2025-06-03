import React, { useState, useRef, useEffect } from 'react';
import { X, GripVertical, Plus, Trash2, Save } from 'lucide-react';
import { useFormContext } from '../context/FormContext';
import { IFormElement, FormMetadata, AcroFieldMapping } from '../types/form';

interface FHIRMetadataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: TabType;
}

type TabType = 'fhir' | 'acrofield' | 'enablewhen';

const FHIRMetadataDialog: React.FC<FHIRMetadataDialogProps> = ({
  isOpen,
  onClose,
  initialTab = 'fhir',
}) => {
  const {
    elements,
    selectedElementId,
    formMetadata,
    updateFormMetadata,
    updateElement,
  } = useFormContext();

  // State for dialog position and active tab
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Temporary state for form metadata and element changes
  const [tempFormMetadata, setTempFormMetadata] = useState<FormMetadata>({});
  const [tempElementData, setTempElementData] = useState<Partial<IFormElement>>({});
  const [hasChanges, setHasChanges] = useState(false);

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

  // Initialize temp state when dialog opens or selected element changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab); // Set the initial tab when dialog opens
      setTempFormMetadata({ ...formMetadata });
      if (selectedElement) {
        setTempElementData({
          linkId: selectedElement.linkId,
          prefix: selectedElement.prefix,
          definition: selectedElement.definition,
          readOnly: selectedElement.readOnly,
          repeats: selectedElement.repeats,
          fhirType: selectedElement.fhirType,
          answerValueSet: selectedElement.answerValueSet,
          maxOccurs: selectedElement.maxOccurs,
          acroField: selectedElement.acroField ? { ...selectedElement.acroField } : undefined,
        });
      }
      setHasChanges(false);
    }
  }, [isOpen, selectedElementId, formMetadata, selectedElement, initialTab]);

  // Handle changes to temporary form metadata
  const handleTempFormMetadataChange = (updates: Partial<FormMetadata>) => {
    setTempFormMetadata(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  // Handle changes to temporary element properties
  const handleTempElementPropertyChange = (
    key: string,
    value: string | boolean | number | undefined
  ) => {
    setTempElementData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Handle changes to temporary AcroField properties
  const handleTempAcroFieldChange = (
    key: string,
    value: string | undefined
  ) => {
    setTempElementData(prev => {
      const currentAcroField = prev.acroField || {};
      return {
        ...prev,
        acroField: { ...currentAcroField, [key]: value }
      };
    });
    setHasChanges(true);
  };

  // Handle answer mapping changes in temporary state
  const handleTempAnswerMappingChange = (
    index: number,
    key: string,
    value: string
  ) => {
    setTempElementData(prev => {
      const currentAcroField = prev.acroField || {};
      const currentMappings = currentAcroField.answerMappings || [];
      const newMappings = [...currentMappings];
      newMappings[index] = { ...newMappings[index], [key]: value };
      
      return {
        ...prev,
        acroField: { ...currentAcroField, answerMappings: newMappings }
      };
    });
    setHasChanges(true);
  };

  // Add new answer mapping to temporary state
  const addTempAnswerMapping = () => {
    setTempElementData(prev => {
      const currentAcroField = prev.acroField || {};
      const currentMappings = currentAcroField.answerMappings || [];
      
      return {
        ...prev,
        acroField: {
          ...currentAcroField,
          answerMappings: [...currentMappings, { answerValue: '', gdtCode: '' }]
        }
      };
    });
    setHasChanges(true);
  };

  // Remove answer mapping from temporary state
  const removeTempAnswerMapping = (index: number) => {
    setTempElementData(prev => {
      const currentAcroField = prev.acroField || {};
      const currentMappings = currentAcroField.answerMappings || [];
      const newMappings = currentMappings.filter((_, i) => i !== index);
      
      return {
        ...prev,
        acroField: { ...currentAcroField, answerMappings: newMappings }
      };
    });
    setHasChanges(true);
  };

  // Save changes and close dialog
  const handleSave = () => {
    // Save form metadata changes
    updateFormMetadata(tempFormMetadata);

    // Save element changes
    if (selectedElement) {
      updateElement(selectedElement.id, tempElementData);
    }

    setHasChanges(false);
    onClose();
  };

  // Handle close without saving
  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close without saving?');
      if (!confirmClose) return;
    }
    onClose();
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
                ? `Properties: ${
                    selectedElement.label || selectedElement.type
                  }`
                : 'Form Metadata'}
            </h2>
            {hasChanges && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Unsaved
              </span>
            )}
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation - Only show for selected elements */}
        {selectedElement && (
          <div className="border-b">
            <nav className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'fhir'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('fhir')}
              >
                FHIR Properties
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'acrofield'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('acrofield')}
              >
                AcroField
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'enablewhen'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('enablewhen')}
              >
                Enable When
              </button>
            </nav>
          </div>
        )}

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
                    value={tempFormMetadata.title || ''}
                    onChange={(e) =>
                      handleTempFormMetadataChange({ title: e.target.value })
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
                    value={tempFormMetadata.status || 'draft'}
                    onChange={(e) =>
                      handleTempFormMetadataChange({
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
                  value={tempFormMetadata.url || ''}
                  onChange={(e) => handleTempFormMetadataChange({ url: e.target.value })}
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
                    value={tempFormMetadata.version || ''}
                    onChange={(e) =>
                      handleTempFormMetadataChange({ version: e.target.value })
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
                    value={tempFormMetadata.date || ''}
                    onChange={(e) =>
                      handleTempFormMetadataChange({ date: e.target.value })
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
                  value={tempFormMetadata.publisher || ''}
                  onChange={(e) =>
                    handleTempFormMetadataChange({ publisher: e.target.value })
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
                  value={tempFormMetadata.description || ''}
                  onChange={(e) =>
                    handleTempFormMetadataChange({ description: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  rows={2}
                  placeholder="A description of the questionnaire..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Natural language description of the questionnaire
                </p>
              </div>
            </div>
          ) : activeTab === 'fhir' ? (
            // Element-specific FHIR properties
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  linkId
                </label>
                <input
                  type="text"
                  value={tempElementData.linkId || ''}
                  onChange={(e) =>
                    handleTempElementPropertyChange('linkId', e.target.value)
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
                  value={tempElementData.prefix || ''}
                  onChange={(e) =>
                    handleTempElementPropertyChange('prefix', e.target.value)
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
                  value={tempElementData.definition || ''}
                  onChange={(e) =>
                    handleTempElementPropertyChange('definition', e.target.value)
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
                      checked={tempElementData.readOnly || false}
                      onChange={(e) =>
                        handleTempElementPropertyChange(
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
                      checked={tempElementData.repeats || false}
                      onChange={(e) =>
                        handleTempElementPropertyChange('repeats', e.target.checked)
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
                  value={tempElementData.fhirType || ''}
                  onChange={(e) =>
                    handleTempElementPropertyChange('fhirType', e.target.value)
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
                  value={tempElementData.answerValueSet || ''}
                  onChange={(e) =>
                    handleTempElementPropertyChange(
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
                    tempElementData.maxOccurs === undefined
                      ? ''
                      : tempElementData.maxOccurs
                  }
                  onChange={(e) =>
                    handleTempElementPropertyChange(
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
          ) : activeTab === 'acrofield' ? (
            // AcroField section
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Instruction
                </label>
                <textarea
                  value={tempElementData.acroField?.inputInstruction || ''}
                  onChange={(e) =>
                    handleTempAcroFieldChange('inputInstruction', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  rows={2}
                  placeholder="Provide instructions for how this field should be processed on input."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Output Instruction
                </label>
                <textarea
                  value={tempElementData.acroField?.outputInstruction || ''}
                  onChange={(e) =>
                    handleTempAcroFieldChange('outputInstruction', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  rows={2}
                  placeholder="Provide instructions for how this field should be processed on output."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default GDT Code
                </label>
                <input
                  type="text"
                  value={tempElementData.acroField?.defaultGDTCode || ''}
                  onChange={(e) =>
                    handleTempAcroFieldChange('defaultGDTCode', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="e.g., 3000, 3001, etc."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Default GDT (Gerätedatentransfer) code for this question.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Answer to GDT Code Mapping
                  </label>
                  <button
                    type="button"
                    onClick={addTempAnswerMapping}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Mapping
                  </button>
                </div>

                {(tempElementData.acroField?.answerMappings || []).map((mapping, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Answer Value
                          </label>
                          <input
                            type="text"
                            value={mapping.answerValue}
                            onChange={(e) =>
                              handleTempAnswerMappingChange(index, 'answerValue', e.target.value)
                            }
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                            placeholder="Answer option value"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            GDT Code
                          </label>
                          <input
                            type="text"
                            value={mapping.gdtCode}
                            onChange={(e) =>
                              handleTempAnswerMappingChange(index, 'gdtCode', e.target.value)
                            }
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                            placeholder="GDT code for this answer"
                          />
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeTempAnswerMapping(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove mapping"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {(!tempElementData.acroField?.answerMappings || tempElementData.acroField.answerMappings.length === 0) && (
                  <div className="text-center py-6 text-sm bg-gray-50 text-gray-400 rounded-lg">
                    No answer mappings configured. Click "Add Mapping" to create mappings between answer values and GDT codes.
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  Map specific answer values to corresponding GDT codes. This allows different answers to generate different GDT output codes.
                </p>
              </div>
            </div>
          ) : (
            // Enable When section - empty for now
            <div className="space-y-6">
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium mb-2">Enable When Configuration</p>
                <p className="text-sm">Interface will be designed here in the future.</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4 flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              hasChanges
                ? 'text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            style={{
              backgroundColor: hasChanges ? 'rgb(45, 45, 133)' : undefined
            }}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FHIRMetadataDialog;
