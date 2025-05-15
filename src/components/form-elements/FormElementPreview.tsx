import React from 'react';
import { FormElement } from '../../types/form';

interface FormElementPreviewProps {
  element: FormElement;
  index?: number;
  showNumbers?: boolean;
  groupTitleAsHeader?: boolean;
}

const FormElementPreview: React.FC<FormElementPreviewProps> = ({ 
  element,
  index,
  showNumbers = false,
  groupTitleAsHeader = false
}) => {
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
            <option value="" disabled selected>
              {element.placeholder || 'Select an option'}
            </option>
            {element.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`preview-${element.id}-${index}`}
                  name={element.id}
                  value={option.value}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
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
        const headerStyle = {
          textAlign: element.header?.align || 'left',
          color: element.header?.color,
          fontStyle: element.header?.italic ? 'italic' : 'normal',
          fontWeight: element.header?.bold ? 'bold' : 'normal',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        };
        const getHeaderSize = () => {
          switch (element.header?.level) {
            case 1: return 'text-4xl';
            case 2: return 'text-3xl';
            case 3: return 'text-2xl';
            case 4: return 'text-xl';
            case 5: return 'text-lg';
            case 6: return 'text-base';
            default: return 'text-2xl';
          }
        };
        return (
          <div 
            className={`${getHeaderSize()} whitespace-pre-wrap break-words`}
            style={headerStyle}
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
      <div className="flex items-center gap-2">
        {showNumbers && index && (
          <span className="text-sm font-medium text-gray-500">
            {index}.
          </span>
        )}
        <label className={`${groupTitleAsHeader && element.type === 'group' ? 'text-xl font-semibold' : 'label'}`}>
          {element.label}
          {element.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      </div>
      {element.description && (
        <p className="text-sm text-gray-500 mb-1">{element.description}</p>
      )}
      {renderElementByType()}
    </div>
  );
};

export default FormElementPreview;