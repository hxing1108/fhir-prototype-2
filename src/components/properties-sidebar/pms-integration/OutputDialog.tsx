import React, { useState, useEffect, useRef } from 'react';
import { RichTextInput } from './components/RichTextInput';
import { useFormContext } from '../../../context/FormContext';
import { IFormElement } from '../../../types/form';

export interface OutputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent?: string;
  currentElementId?: string;
}

export const OutputDialog: React.FC<OutputDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent = '',
  currentElementId,
}) => {
  const [selectedOutputVariable, setSelectedOutputVariable] = useState('');
  const [selectedLinkId, setSelectedLinkId] = useState('');
  const [content, setContent] = useState(initialContent);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { elements } = useFormContext();

  // Output variables for first dropdown
  const outputVariables = [
    { label: 'Content', value: '#CONTENT#' },
    { label: 'Patient Birth Date', value: '#DD:MM:YYYY:PATIENTBIRTHDATE#' },
    { label: 'Current Date', value: '#DD:MM:YYYY:CURRENTDATE#' },
    { label: 'Current Time', value: '#HH:MM:CURRENTTIME#' },
  ];

  // Get all linkIds from form elements recursively
  const getAllLinkIds = (
    els: IFormElement[]
  ): Array<{ label: string; value: string }> => {
    const linkIds: Array<{ label: string; value: string }> = [];

    const traverse = (elements: IFormElement[]) => {
      elements.forEach((element) => {
        // Skip the current element
        if (element.id !== currentElementId && element.linkId) {
          linkIds.push({
            label: `${element.linkId} (${element.label || 'Untitled'})`,
            value: `#${element.linkId}#`,
          });
        }
        if (element.elements) {
          traverse(element.elements);
        }
      });
    };

    traverse(els);
    return linkIds;
  };

  const linkIdOptions = getAllLinkIds(elements);

  const handleOutputVariableSelect = (variableValue: string) => {
    if (variableValue) {
      setContent((prev) => prev + variableValue);
      setSelectedOutputVariable('');
    }
  };

  const handleLinkIdSelect = (linkIdValue: string) => {
    if (linkIdValue) {
      setContent((prev) => prev + linkIdValue);
      setSelectedLinkId('');
    }
  };

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const handleClose = () => {
    setContent(initialContent); // Reset to initial content instead of empty
    setSelectedOutputVariable('');
    setSelectedLinkId('');
    onClose();
  };

  // Update content when initialContent changes or when dialog opens
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [initialContent, isOpen]);

  // Reset position state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
    }
  }, [isOpen]);

  // Position the dialog near the PMS Integration panel when it opens
  useEffect(() => {
    if (isOpen && !isPositioned) {
      setTimeout(() => {
        const pmsPanel = document.querySelector(
          '[data-testid="pms-integration-panel"]'
        );

        if (pmsPanel) {
          const panelRect = pmsPanel.getBoundingClientRect();
          const dialogWidth = 500;
          const dialogHeight = 500;

          let x = panelRect.left - dialogWidth - 30;
          let y = panelRect.top + 50;

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
          setPosition({ x: 150, y: 150 });
        }
        setIsPositioned(true);
      }, 50);
    } else if (!isOpen) {
      setIsPositioned(false);
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
  }, [isOpen, headerRef, dialogRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed z-50 shadow-xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '500px',
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
              <circle cx="9" cy="12" r="1"></circle>
              <circle cx="9" cy="5" r="1"></circle>
              <circle cx="9" cy="19" r="1"></circle>
              <circle cx="15" cy="12" r="1"></circle>
              <circle cx="15" cy="5" r="1"></circle>
              <circle cx="15" cy="19" r="1"></circle>
            </svg>
            <h2 className="text-lg font-semibold">Output to PMS</h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insert variables for "OUT section"
            </label>

            {/* First dropdown - Output variables */}
            <div className="mb-3">
              <select
                value={selectedOutputVariable}
                onChange={(e) => handleOutputVariableSelect(e.target.value)}
                className="input"
              >
                <option value="">Select output variable...</option>
                {outputVariables.map((variable) => (
                  <option key={variable.value} value={variable.value}>
                    {variable.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Second dropdown - LinkIds from other questions */}
            <div>
              <select
                value={selectedLinkId}
                onChange={(e) => handleLinkIdSelect(e.target.value)}
                className="input"
                disabled={linkIdOptions.length === 0}
              >
                <option value="">
                  {linkIdOptions.length === 0
                    ? 'No other questions available'
                    : 'Select question linkId...'}
                </option>
                {linkIdOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <RichTextInput
              value={content}
              onChange={setContent}
              placeholder="Enter text or select variables from the dropdowns above..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-[#2D2D85] rounded-md hover:bg-[#1E1E5A] flex items-center"
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
                className="mr-2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
