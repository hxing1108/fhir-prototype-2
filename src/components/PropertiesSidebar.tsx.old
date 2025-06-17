import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from '../context/FormContext';
import { IFormElement } from '../types/form';
import { ExternalLink, X } from 'lucide-react';

// Variable Pill Component
interface VariablePillProps {
  variable: string;
  onRemove: () => void;
}

const VariablePill: React.FC<VariablePillProps> = ({ variable, onRemove }) => {
  // Extract readable name from variable format
  const getReadableName = (variable: string) => {
    // Remove # symbols and extract the main identifier
    const cleaned = variable.replace(/#/g, '');
    if (cleaned.includes(':')) {
      const parts = cleaned.split(':');
      return parts[parts.length - 1]; // Get the last part (e.g., PATIENTNAME from DD:MM:YYYY:PATIENTNAME)
    }
    return cleaned;
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-1 mb-1">
      {getReadableName(variable)}
      <button
        onClick={onRemove}
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
        type="button"
      >
        <X size={12} />
      </button>
    </span>
  );
};

// Rich Text Input with Variable Pills
interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onVariableInsert?: () => void;
}

const RichTextInput: React.FC<RichTextInputProps> = ({
  value,
  onChange,
  placeholder,
  onVariableInsert,
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string>();

  // Convert content to HTML with pills
  const contentToHtml = (content: string) => {
    const parts = [];
    const regex = /#[^#]+#/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Add text before the variable
      if (match.index > lastIndex) {
        const textPart = content.slice(lastIndex, match.index);
        if (textPart) {
          // Escape HTML in text parts
          const escaped = textPart
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          parts.push(escaped);
        }
      }

      // Add the variable as a pill
      const varName = match[0].replace(/#/g, '').split(':').pop() || match[0];
      parts.push(
        `<span contenteditable="false" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mx-1 select-none" data-variable="${match[0]}">${varName}<button class="variable-delete text-blue-600 hover:text-blue-800" type="button">×</button></span>`
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textPart = content.slice(lastIndex);
      const escaped = textPart
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      parts.push(escaped);
    }

    return parts.join('');
  };

  // Get current cursor position info
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    if (contentEditableRef.current) {
      preCaretRange.selectNodeContents(contentEditableRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
    }

    return {
      offset: preCaretRange.toString().length,
      container: range.endContainer,
      containerOffset: range.endOffset,
    };
  };

  // Restore cursor position
  const restoreCursorPosition = (position: any) => {
    if (
      !position ||
      !contentEditableRef.current ||
      typeof position.offset !== 'number'
    )
      return;

    const selection = window.getSelection();
    if (!selection) return;

    // Validate offset is not negative or invalid
    if (position.offset < 0 || position.offset === 4294967295) return;

    let charCount = 0;

    const traverseNodes = (node: Node): boolean => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (charCount + textLength >= position.offset) {
          const range = document.createRange();
          const targetOffset = Math.max(
            0,
            Math.min(position.offset - charCount, textLength)
          );
          try {
            range.setStart(node, targetOffset);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            return true;
          } catch (error) {
            console.warn('Failed to restore cursor position:', error);
            return false;
          }
        }
        charCount += textLength;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip pill elements
        const element = node as HTMLElement;
        if (element.hasAttribute('data-variable')) {
          charCount += 1; // Count as one character for cursor positioning
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            if (traverseNodes(node.childNodes[i])) return true;
          }
        }
      }
      return false;
    };

    try {
      traverseNodes(contentEditableRef.current);
    } catch (error) {
      console.warn('Error in cursor position restoration:', error);
    }
  };

  // Convert HTML back to content string
  const htmlToContent = () => {
    if (!contentEditableRef.current) return '';

    let result = '';
    const traverseNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.hasAttribute('data-variable')) {
          result += element.getAttribute('data-variable') || '';
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            traverseNodes(node.childNodes[i]);
          }
        }
      }
    };

    traverseNodes(contentEditableRef.current);
    return result;
  };

  // Initial render and content updates
  useEffect(() => {
    if (contentEditableRef.current && value !== lastValueRef.current) {
      const cursorPos = saveCursorPosition();
      const htmlContent = contentToHtml(value);
      contentEditableRef.current.innerHTML = htmlContent;

      // Only restore cursor position if we had a valid previous position
      // and this isn't the initial load
      if (cursorPos && lastValueRef.current !== undefined) {
        setTimeout(() => restoreCursorPosition(cursorPos), 0);
      }

      lastValueRef.current = value;
    }
  }, [value]);

  const handleInput = () => {
    const newContent = htmlToContent();
    if (newContent !== lastValueRef.current) {
      lastValueRef.current = newContent;
      onChange(newContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Check if we're at the start of a text node right after a pill
        if (range.collapsed && range.startOffset === 0) {
          const node = range.startContainer;
          const prevSibling = node.previousSibling;

          if (prevSibling && prevSibling.nodeType === Node.ELEMENT_NODE) {
            const element = prevSibling as HTMLElement;
            if (element.hasAttribute('data-variable')) {
              e.preventDefault();
              const cursorPos = saveCursorPosition();
              element.remove();
              handleInput();
              setTimeout(() => restoreCursorPosition(cursorPos), 0);
            }
          }
        }
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('variable-delete')) {
      e.preventDefault();
      const pill = target.closest('[data-variable]');
      if (pill) {
        const cursorPos = saveCursorPosition();
        pill.remove();
        handleInput();
        setTimeout(() => restoreCursorPosition(cursorPos), 0);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
      selection.collapseToEnd();
      handleInput();
    }
  };

  return (
    <div className="relative">
      <div
        ref={contentEditableRef}
        contentEditable
        className="block w-full px-3 py-2 border border-gray-300 rounded-md min-h-[120px] focus:ring-2 focus:ring-[#2D2D85] focus:border-transparent transition duration-200 overflow-auto whitespace-pre-wrap"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      {!value && (
        <div className="absolute top-2 left-3 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};
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

// Variable Selection Dialog Component
interface VariableSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent?: string;
}

const VariableSelectionDialog: React.FC<VariableSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent = '',
}) => {
  const [selectedVariable, setSelectedVariable] = useState('');
  const [content, setContent] = useState(initialContent);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Available variables for PMS integration
  const variables = [
    { label: 'Patient Birth Date', value: '#DD:MM:YYYY:PATIENTBIRTHDATE#' },
    { label: 'Patient Name', value: '#PATIENTNAME#' },
    { label: 'Patient ID', value: '#PATIENTID#' },
    { label: 'Current Date', value: '#DD:MM:YYYY:CURRENTDATE#' },
    { label: 'Current Time', value: '#HH:MM:CURRENTTIME#' },
    { label: 'Doctor Name', value: '#DOCTORNAME#' },
    { label: 'Practice Name', value: '#PRACTICENAME#' },
  ];

  const handleVariableSelect = (variableValue: string) => {
    setContent((prev) => prev + variableValue);
    setSelectedVariable('');
  };

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const handleClose = () => {
    setContent(initialContent); // Reset to initial content instead of empty
    setSelectedVariable('');
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
          const dialogHeight = 450; // Approximate dialog height

          // Position to the left of the panel with some spacing
          let x = panelRect.left - dialogWidth - 30; // 30px gap
          let y = panelRect.top + 50; // Offset down a bit from panel top

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

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insert variables for "IN section"
            </label>
            <select
              value={selectedVariable}
              onChange={(e) => handleVariableSelect(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a variable...</option>
              {variables.map((variable) => (
                <option key={variable.value} value={variable.value}>
                  {variable.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <RichTextInput
              value={content}
              onChange={setContent}
              placeholder="Enter text or select variables from the dropdown above..."
            />
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white rounded-md flex items-center space-x-2"
            style={{ backgroundColor: 'rgb(45, 45, 133)' }}
            onClick={handleSave}
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
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17,21 17,13 7,13 7,21"></polyline>
              <polyline points="7,3 7,8 15,8"></polyline>
            </svg>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showVariableDialog, setShowVariableDialog] = useState(false);
  const [pmsEnabled, setPmsEnabled] = useState({
    takeover: false,
    output: false,
  });
  const [savedContent, setSavedContent] = useState<{
    [elementId: string]: string;
  }>({});

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

  const handleToggleTakeoverPMS = () => {
    if (!pmsEnabled.takeover) {
      // When enabling, open the dialog to configure
      setShowVariableDialog(true);
      setPmsEnabled((prev) => ({ ...prev, takeover: true }));
    } else {
      // When disabling, just turn it off
      setPmsEnabled((prev) => ({ ...prev, takeover: false }));
    }
  };

  const handleOpenTakeoverDialog = () => {
    setShowVariableDialog(true);
  };

  const handleToggleOutputPMS = () => {
    setPmsEnabled((prev) => ({ ...prev, output: !prev.output }));
  };

  const handleVariableSave = (content: string) => {
    console.log('Saved PMS content:', content);
    // Save the content for the current selected element
    if (selectedElement) {
      setSavedContent((prev) => ({
        ...prev,
        [selectedElement.id]: content,
      }));
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

  // Dialog key for forcing remounts when content changes
  const dialogKey = `${selectedElement?.id}-${
    savedContent[selectedElement?.id || ''] || ''
  }`;
  const initialContentValue = selectedElement
    ? savedContent[selectedElement.id] || ''
    : '';

  return (
    <>
      <div className="h-full flex flex-col overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="sidebar-title">Properties</h3>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4">{renderPropertiesByType()}</div>
        </div>

        {/* PMS Integration Buttons */}
        <div
          className="p-4 border-t border-gray-200 space-y-3"
          data-testid="pms-integration-panel"
        >
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            PMS Integration
          </h4>

          {/* Takeover from PMS */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Takeover from PMS
            </span>
            <div className="flex items-center space-x-3">
              {pmsEnabled.takeover && (
                <button
                  onClick={handleOpenTakeoverDialog}
                  className="px-3 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 flex items-center"
                  title="Edit Configuration"
                >
                  <ExternalLink size={16} />
                </button>
              )}
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={pmsEnabled.takeover}
                  onChange={handleToggleTakeoverPMS}
                />
                <div className="toggle-switch-track">
                  <div className="toggle-switch-thumb"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Output to PMS system */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Output to PMS system
            </span>
            <div className="flex items-center space-x-3">
              {pmsEnabled.output && (
                <button
                  className="px-3 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 flex items-center"
                  title="Edit Configuration"
                >
                  <ExternalLink size={16} />
                </button>
              )}
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={pmsEnabled.output}
                  onChange={handleToggleOutputPMS}
                />
                <div className="toggle-switch-track">
                  <div className="toggle-switch-thumb"></div>
                </div>
              </label>
            </div>
          </div>

          {!selectedElement && (
            <p className="mt-2 text-xs text-gray-500 text-center">
              Select an element to configure PMS settings
            </p>
          )}
        </div>
      </div>

      {/* Variable Selection Dialog */}
      <VariableSelectionDialog
        key={dialogKey}
        isOpen={showVariableDialog}
        onClose={() => setShowVariableDialog(false)}
        onSave={handleVariableSave}
        initialContent={initialContentValue}
      />
    </>
  );
};

export default PropertiesSidebar;
