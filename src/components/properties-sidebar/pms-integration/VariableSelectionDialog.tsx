import React, { useState, useEffect, useRef } from 'react';
import { RichTextInput } from './components/RichTextInput';
import {
  CustomDropdownWithGDT,
  DropdownOption,
} from './components/CustomDropdownWithGDT';

export interface VariableSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent?: string;
}

export const VariableSelectionDialog: React.FC<
  VariableSelectionDialogProps
> = ({ isOpen, onClose, onSave, initialContent = '' }) => {
  const [content, setContent] = useState(initialContent);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Available variables for PMS integration
  const variables: DropdownOption[] = [
    {
      label: 'Patient Birth Date',
      value: '#PATIENTBIRTHDATE#',
    },
    { label: 'Patient Name', value: '#PATIENTNAME#' },
    { label: 'Patient Given Name', value: '#PATIENTGIVENNAME#' },
    { label: 'Patient Sex', value: '#PATIENTSEX#' },
    { label: 'Current Date', value: '#CUR_DATE#' },
    { label: 'Doctor Name', value: '#DOCTORNAME#' },
    { label: 'Practice Name', value: '#PRACTICENAME#' },
  ];

  const handleVariableSelect = (variableValue: string) => {
    setContent((prev) => prev + variableValue);
  };

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const handleClose = () => {
    setContent(initialContent); // Reset to initial content instead of empty
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
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const pmsPanel = document.querySelector(
          '[data-testid="pms-integration-panel"]'
        );

        if (pmsPanel) {
          const panelRect = pmsPanel.getBoundingClientRect();
          const dialogWidth = 500; // Approximate dialog width
          const dialogHeight = 450; // Dialog height

          // Position to the left of the panel with some spacing
          let x = panelRect.left - dialogWidth - 30; // 30px gap
          let y = panelRect.top + 20; // Reduced offset since dialog is taller

          // Ensure dialog doesn't go off-screen to the left
          if (x < 20) {
            x = panelRect.right + 30; // Position to the right instead
          }

          // Ensure dialog doesn't go off-screen to the right
          if (x + dialogWidth > window.innerWidth - 20) {
            x = window.innerWidth - dialogWidth - 20;
          }

          // Ensure dialog doesn't go below viewport
          const maxY = window.innerHeight - dialogHeight - 20;
          if (y > maxY) {
            y = maxY;
          }

          // Ensure dialog doesn't go above viewport
          if (y < 20) {
            y = 20;
          }

          setPosition({ x, y });
        } else {
          // Fallback position if panel not found
          setPosition({ x: 150, y: 150 });
        }
        setIsPositioned(true);
      }, 50);
    } else if (!isOpen) {
      setIsPositioned(false);
    }
  }, [isOpen, isPositioned]);

  // Drag functionality - similar to FHIR dialog
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
        maxWidth: '500px',
        width: '100%',
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh', minHeight: '450px' }}
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
            <h2 className="text-lg font-semibold">Takeover from PMS</h2>
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

        <div className="p-6 flex flex-col flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insert variables for "IN section"
            </label>
            <CustomDropdownWithGDT
              options={variables}
              onSelect={handleVariableSelect}
              placeholder="Select a variable..."
              className="w-full"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <RichTextInput
                value={content}
                onChange={setContent}
                placeholder="Enter text or select variables from the dropdown above..."
                className="h-full"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-auto">
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
