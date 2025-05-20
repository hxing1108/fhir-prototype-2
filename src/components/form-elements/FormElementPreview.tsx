import React, { useState } from 'react';
import { IFormElement, FormElementOption } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { HelpCircle } from 'lucide-react';

interface FormElementPreviewProps {
  element: IFormElement;
  index?: number;
  showNumbers?: boolean;
  groupTitleAsHeader?: boolean;
}

const FormElementPreview: React.FC<FormElementPreviewProps> = ({
  element,
  index,
  showNumbers = false,
  groupTitleAsHeader = false,
}) => {
  const { updateFormData, formData, formSettings } = useFormContext();
  const [value, setValue] = useState<string | string[] | boolean | number>(
    formData[element.id] || element.defaultValue || ''
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const newValue =
      e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;

    setValue(newValue);
    updateFormData(element.id, newValue);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    optionValue: string
  ) => {
    let newValue: string[];

    if (Array.isArray(value)) {
      if (e.target.checked) {
        newValue = [...value, optionValue];
      } else {
        newValue = value.filter((v) => v !== optionValue);
      }
    } else {
      newValue = e.target.checked ? [optionValue] : [];
    }

    setValue(newValue);
    updateFormData(element.id, newValue);
  };

  const handleYesNoChange = (selectedValue: boolean) => {
    setValue(selectedValue);
    updateFormData(element.id, selectedValue);
  };

  // Helper for rendering question numbers
  const renderQuestionNumber = () => {
    if (!formSettings.showQuestionNumbers || !index) return null;
    return <span className="mr-2">{index}.</span>;
  };

  // Render the appropriate preview based on element type
  const renderPreview = () => {
    switch (element.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={element.type}
            value={value as string}
            onChange={handleChange}
            placeholder={element.placeholder}
            required={element.required}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value as string}
            onChange={handleChange}
            placeholder={element.placeholder}
            required={element.required}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={handleChange}
            placeholder={element.placeholder}
            required={element.required}
            min={element.min}
            max={element.max}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value as string}
            onChange={handleChange}
            required={element.required}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        );

      case 'select':
        return (
          <select
            value={value as string}
            onChange={handleChange}
            required={element.required}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select an option</option>
            {element.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {element.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${element.id}-${option.value}`}
                  checked={
                    Array.isArray(value) ? value.includes(option.value) : false
                  }
                  onChange={(e) => handleCheckboxChange(e, option.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor={`${element.id}-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
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
            {element.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${element.id}-${option.value}`}
                  name={element.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor={`${element.id}-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'yesNo':
        return (
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleYesNoChange(true)}
              className={`px-4 py-2 rounded-md ${
                value === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {element.yesLabel || 'Yes'}
            </button>
            <button
              type="button"
              onClick={() => handleYesNoChange(false)}
              className={`px-4 py-2 rounded-md ${
                value === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {element.noLabel || 'No'}
            </button>
          </div>
        );

      case 'group':
        return (
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            {element.elements?.map((childElement, idx) => (
              <div key={childElement.id} className="mb-4">
                <FormElementPreview element={childElement} index={idx + 1} />
              </div>
            ))}
          </div>
        );

      case 'header':
        const HeaderTag = `h${
          element.header?.level || 2
        }` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag
            style={{
              textAlign: element.header?.align || 'left',
              color: element.header?.color,
            }}
          >
            {element.label}
          </HeaderTag>
        );

      case 'image':
        return (
          <div
            style={{
              textAlign: element.image?.align || 'left',
            }}
          >
            <img
              src={element.image?.src}
              alt={element.image?.alt || ''}
              style={{
                width: element.image?.width || '100%',
                height: element.image?.height || 'auto',
              }}
              className="max-w-full"
            />
          </div>
        );

      default:
        return <div>Unsupported element type: {element.type}</div>;
    }
  };

  // Don't render anything for display-only elements in the response
  if (element.type === 'header' || element.type === 'image') {
    return renderPreview();
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {renderQuestionNumber()}
        {element.label}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {element.description && (
        <p className="text-sm text-gray-500 mb-2">{element.description}</p>
      )}

      {renderPreview()}
    </div>
  );
};

export default FormElementPreview;
