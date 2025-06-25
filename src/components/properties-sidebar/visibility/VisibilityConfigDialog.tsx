import React, { useState, useEffect, useRef } from 'react';
import { VisibilitySettings, VisibilityRule } from '../../../types/form';
import { useFormContext } from '../../../context/FormContext';
import { v4 as uuidv4 } from 'uuid';

export interface VisibilityConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: VisibilitySettings) => void;
  initialSettings?: VisibilitySettings;
  currentElementId?: string;
}

export const VisibilityConfigDialog: React.FC<VisibilityConfigDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings,
  currentElementId,
}) => {
  const { elements } = useFormContext();
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>(
    initialSettings || {
      enabled: true,
      rules: [],
      defaultAction: 'show',
    }
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Get available fields for conditions (excluding current element)
  const getAvailableFields = () => {
    const fields: Array<{ id: string; label: string; type: string }> = [];
    
    const collectFields = (elements: any[], parentLabel = '') => {
      elements.forEach((element) => {
        if (element.id !== currentElementId && element.type !== 'group' && element.type !== 'header') {
          fields.push({
            id: element.id,
            label: parentLabel ? `${parentLabel} > ${element.label}` : element.label,
            type: element.type,
          });
        }
        if (element.elements) {
          collectFields(element.elements, parentLabel ? `${parentLabel} > ${element.label}` : element.label);
        }
      });
    };
    
    collectFields(elements);
    return fields;
  };

  const availableFields = getAvailableFields();

  const handleSave = () => {
    onSave(visibilitySettings);
    onClose();
  };

  const handleClose = () => {
    setVisibilitySettings(initialSettings || {
      enabled: true,
      rules: [],
      defaultAction: 'show',
    });
    onClose();
  };

  const handleAddRule = () => {
    const newRule: VisibilityRule = {
      id: uuidv4(),
      conditions: [],
      action: 'show',
      targetType: 'next_question',
    };
    
    setVisibilitySettings(prev => ({
      ...prev,
      rules: [...prev.rules, newRule],
    }));
  };

  const handleDeleteRule = (ruleId: string) => {
    setVisibilitySettings(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== ruleId),
    }));
  };

  const handleDeleteAllRules = () => {
    setVisibilitySettings(prev => ({
      ...prev,
      rules: [],
    }));
  };

  // Update settings when initialSettings changes
  useEffect(() => {
    if (isOpen && initialSettings) {
      setVisibilitySettings(initialSettings);
    }
  }, [initialSettings, isOpen]);

  // Reset position state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
    }
  }, [isOpen]);

  // Position the dialog near the Visibility panel when it opens
  useEffect(() => {
    if (isOpen && !isPositioned) {
      setTimeout(() => {
        const visibilityPanel = document.querySelector('[data-testid="visibility-panel"]');

        if (visibilityPanel) {
          const panelRect = visibilityPanel.getBoundingClientRect();
          const dialogWidth = 800; // Wider dialog for visibility rules
          const dialogHeight = 600;

          let x = panelRect.left - dialogWidth - 30;
          let y = panelRect.top + 20;

          // Ensure dialog doesn't go off-screen
          if (x < 20) {
            x = panelRect.right + 30;
          }
          if (x + dialogWidth > window.innerWidth - 20) {
            x = window.innerWidth - dialogWidth - 20;
          }

          const maxY = window.innerHeight - dialogHeight - 20;
          if (y > maxY) {
            y = maxY;
          }
          if (y < 20) {
            y = 20;
          }

          setPosition({ x, y });
        } else {
          setPosition({ x: 200, y: 150 });
        }
        setIsPositioned(true);
      }, 50);
    }
  }, [isOpen, isPositioned]);

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

    headerRef.current.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      headerRef.current?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed z-50 shadow-xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '800px',
        width: '100%',
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh', minHeight: '600px' }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-center justify-between border-b p-4 cursor-move bg-gray-50"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 mr-2"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Edit logic for this question</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Rules Section */}
            <div className="space-y-4">
              {visibilitySettings.rules.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto"
                    >
                      <path d="M9 12l2 2 4-4" />
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No logic rules yet</h4>
                  <p className="text-gray-500 mb-4">
                    Add conditions to control when this question appears
                  </p>
                  <button
                    onClick={handleAddRule}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add first rule
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibilitySettings.rules.map((rule, index) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Rule {index + 1}</h5>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete rule
                        </button>
                      </div>
                      
                      {/* Placeholder for rule configuration */}
                      <div className="space-y-3">
                        <div className="text-sm text-gray-500">
                          Rule configuration will be implemented in Phase 2
                        </div>
                        
                        {/* Show available fields for debugging */}
                        <details className="text-xs text-gray-400">
                          <summary>Available fields ({availableFields.length})</summary>
                          <ul className="mt-2 space-y-1">
                            {availableFields.map(field => (
                              <li key={field.id}>{field.label} ({field.type})</li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleAddRule}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                  >
                    + Add rule
                  </button>
                </div>
              )}
            </div>

            {/* Default Action */}
            {visibilitySettings.rules.length > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">All other cases:</span>
                  <select
                    value={visibilitySettings.defaultAction}
                    onChange={(e) => setVisibilitySettings(prev => ({
                      ...prev,
                      defaultAction: e.target.value as 'show' | 'hide'
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="show">Show this question</option>
                    <option value="hide">Hide this question</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              {visibilitySettings.rules.length > 0 && (
                <button
                  onClick={handleDeleteAllRules}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete all rules
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 