import React, { useState } from 'react';
import { IFormElement } from '../../types/form';
import { HelpCircle } from 'lucide-react';

interface FormElementPreviewProps {
  element: IFormElement;
  index?: string | number | undefined;
  showNumbers?: boolean;
  groupTitleAsHeader?: boolean;
}

const FormElementPreview: React.FC<FormElementPreviewProps> = ({ 
  element,
  index,
  showNumbers = false,
  groupTitleAsHeader = false
}) => {
  // Mapping from fontSize keys to Tailwind CSS classes - Co-locate for clarity or import from a shared constants file
  const fontSizeKeyToClassMap: Record<string, string> = {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-base',
  };
  const defaultFontSizeKey = 'h3'; // Corresponds to text-2xl for heading mode if no size is set
  const defaultRawFontSizeClass = fontSizeKeyToClassMap[defaultFontSizeKey];

  // State for the free text input value and whether "Other" is checked
  const initialFreeTextValue = Array.isArray(element.defaultValue) && element.defaultValue.includes(element.freeTextLabel || 'Other:') 
                                ? (element.freeTextValue || '') 
                                : '';
  const initialOtherChecked = Array.isArray(element.defaultValue) && element.defaultValue.includes(element.freeTextLabel || 'Other:');

  const [otherChecked, setOtherChecked] = useState(initialOtherChecked);
  const [freeTextInput, setFreeTextInput] = useState(initialFreeTextValue);

  // Handle change for the "Other" checkbox
  const handleOtherCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherChecked(e.target.checked);
    if (!e.target.checked) {
      setFreeTextInput(''); // Clear text if "Other" is unchecked
      // Here you might also want to update the form's actual data if this preview were fully interactive
      // For now, it just manages its own state for rendering.
    }
  };

  // Handle change for the free text input
  const handleFreeTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeTextInput(e.target.value);
    // Similarly, update form data if needed
  };

  const renderElementByType = () => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            className="input"
            required={element.required}
            min={element.min}
            max={element.max}
            pattern={element.pattern}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            className="input"
            required={element.required}
            rows={3}
          ></textarea>
        );
      case 'select':
        return (
          <select 
            className="input"
            required={element.required}
          >
            <option value="" disabled selected={!element.defaultValue}>
              {element.placeholder || 'Select an option'}
            </option>
            {element.options?.map((option, optionIndex) => (
              <option key={optionIndex} value={option.value} selected={element.defaultValue === option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        const freeTextCheckboxId = `preview-${element.id}-freetext-checkbox`;
        const freeTextActualLabel = element.freeTextLabel || 'Other:';
        return (
          <div className="space-y-2">
            {element.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <input
                  type="checkbox"
                  id={`preview-${element.id}-${optionIndex}`}
                  name={element.id}
                  value={option.value}
                  defaultChecked={Array.isArray(element.defaultValue) && element.defaultValue.includes(option.value)}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`preview-${element.id}-${optionIndex}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
            {element.allowFreeText && (
              <div className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={freeTextCheckboxId}
                    name={element.id}
                    value={freeTextActualLabel}
                    checked={otherChecked}
                    onChange={handleOtherCheckboxChange}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={freeTextCheckboxId}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {freeTextActualLabel}
                  </label>
                </div>
                {otherChecked && (
                  <input
                    type="text"
                    value={freeTextInput}
                    onChange={handleFreeTextInputChange}
                    placeholder="Please specify..."
                    className="input ml-6"
                  />
                )}
              </div>
            )}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`preview-${element.id}-${index}`}
                  name={element.id}
                  value={option.value}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                />
                <label
                  htmlFor={`preview-${element.id}-${index}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case 'group':
        return (
          <div className="pl-4 border-l-2 border-gray-200 mt-4 space-y-4">
            {element.elements?.map((childElement, childIndex) => (
              <div key={childElement.id} className="mb-6">
                <FormElementPreview 
                  element={childElement}
                  index={index ? `${index}.${childIndex + 1}` : undefined}
                  showNumbers={showNumbers}
                  groupTitleAsHeader={groupTitleAsHeader}
                />
              </div>
            ))}
          </div>
        );
      case 'header':
        const headerConfig = element.header;
        const displayMode = headerConfig?.displayMode || 'heading';
        const fontSizeKey = headerConfig?.fontSize || defaultFontSizeKey;
        
        // Determine fontSizeClass: empty for rich text, calculated for heading
        const fontSizeClass = displayMode === 'heading' 
                              ? (fontSizeKeyToClassMap[fontSizeKey] || defaultRawFontSizeClass)
                              : '';

        const previewHeaderStyle: React.CSSProperties = {
          textAlign: headerConfig?.align || 'left',
          color: headerConfig?.color,
          fontStyle: headerConfig?.italic ? 'italic' : 'normal',
          fontWeight: headerConfig?.bold ? 'bold' : 'normal',
          width: '100%', // Ensure full width for alignment
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          // whiteSpace: 'pre-wrap', // Consider if needed for rich text vs. heading text
        };

        if (displayMode === 'richtext') {
          return (
            <div 
              className={`w-full ${fontSizeClass}`} // fontSizeClass will be empty string
              style={previewHeaderStyle}
              dangerouslySetInnerHTML={{ __html: element.label || '' }}
            />
          );
        }
        
        // Default to 'heading' mode
        return (
          <div 
            className={`w-full ${fontSizeClass} whitespace-pre-wrap break-words`} // Added whitespace-pre-wrap & break-words for heading text
            style={previewHeaderStyle}
          >
            {element.label}
          </div>
        );
      case 'image':
        const imageStyle = {
          textAlign: element.image?.align || 'left',
          maxWidth: element.image?.width || '100%',
          height: element.image?.height || 'auto',
        };
        return (
          <div style={{ textAlign: element.image?.align || 'left' }}>
            {element.image?.src && (
              <img
                src={element.image.src}
                alt={element.image.alt}
                style={imageStyle}
                className="max-w-full h-auto"
              />
            )}
          </div>
        );
      default:
        return <div>Unknown element type</div>;
    }
  };

  if (element.type === 'header' || element.type === 'image') {
    return renderElementByType();
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {showNumbers && index && (
          <span className="text-sm font-medium text-gray-500 flex-shrink-0">
            {index}.
          </span>
        )}
        {element.showTooltip && (
          <div className="relative group/tooltip flex-shrink-0">
            <HelpCircle size={16} className="text-gray-400" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50">
              {element.tooltipText || 'Tooltip text'}
              <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
        <label 
          className={`${groupTitleAsHeader && element.type === 'group' ? 'text-xl font-semibold' : 'label'} flex-1 min-w-0`}
          style={{ marginBottom: 0 }}
        >
          {element.label}
          {element.required && <span className="text-error-500 ml-1">*</span>}
        </label>
        {element.type === 'yesNo' && (() => {
          const yesVal = element.yesLabel || 'Yes';
          const noVal = element.noLabel || 'No';
          return (
            <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id={`preview-${element.id}-yes`} 
                  name={`preview-${element.id}`} 
                  value={yesVal} 
                  checked={element.defaultValue === yesVal}
                  disabled 
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor={`preview-${element.id}-yes`} className="ml-2 text-sm text-gray-700">
                  {yesVal}
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id={`preview-${element.id}-no`} 
                  name={`preview-${element.id}`} 
                  value={noVal} 
                  checked={element.defaultValue === noVal}
                  disabled 
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor={`preview-${element.id}-no`} className="ml-2 text-sm text-gray-700">
                  {noVal}
                </label>
              </div>
            </div>
          );
        })()}
      </div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      {element.type !== 'yesNo' && renderElementByType()}
    </div>
  );
};

export default FormElementPreview;