import React from 'react';
import { useFormContext } from '../../context/FormContext';

const FormProperties: React.FC = () => {
  const { formSettings, updateFormSettings } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Form Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="label">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formSettings.backgroundColor}
                onChange={(e) => updateFormSettings({ backgroundColor: e.target.value })}
                className="h-8 w-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={formSettings.backgroundColor}
                onChange={(e) => updateFormSettings({ backgroundColor: e.target.value })}
                className="input flex-1"
              />
            </div>
          </div>

          <div>
            <label className="label">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formSettings.textColor}
                onChange={(e) => updateFormSettings({ textColor: e.target.value })}
                className="h-8 w-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={formSettings.textColor}
                onChange={(e) => updateFormSettings({ textColor: e.target.value })}
                className="input flex-1"
              />
            </div>
          </div>

          <div>
            <label className="label">Font Family</label>
            <select
              value={formSettings.fontFamily}
              onChange={(e) => updateFormSettings({ fontFamily: e.target.value })}
              className="input"
            >
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <div>
            <label className="label">Font Size</label>
            <select
              value={formSettings.fontSize}
              onChange={(e) => updateFormSettings({ fontSize: e.target.value })}
              className="input"
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="18px">Large (18px)</option>
              <option value="20px">Extra Large (20px)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700">
              Display Group Title as Header
            </label>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={formSettings.groupTitleAsHeader}
                onChange={(e) => updateFormSettings({ groupTitleAsHeader: e.target.checked })}
                className="sr-only"
                id="groupTitleAsHeader"
              />
              <label
                htmlFor="groupTitleAsHeader"
                className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                  formSettings.groupTitleAsHeader ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`block w-4 h-4 mt-1 ml-1 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    formSettings.groupTitleAsHeader ? 'transform translate-x-6' : ''
                  }`}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700">
              Show Question Numbers
            </label>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={formSettings.showQuestionNumbers}
                onChange={(e) => updateFormSettings({ showQuestionNumbers: e.target.checked })}
                className="sr-only"
                id="showQuestionNumbers"
              />
              <label
                htmlFor="showQuestionNumbers"
                className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                  formSettings.showQuestionNumbers ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`block w-4 h-4 mt-1 ml-1 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    formSettings.showQuestionNumbers ? 'transform translate-x-6' : ''
                  }`}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProperties;