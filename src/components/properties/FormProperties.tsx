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

          <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
            <div>
              <label className="text-sm font-medium text-gray-900 block">
                Display Group Title as Header
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Visually styles the group's title text as a prominent header
              </p>
            </div>
            <button
              role="switch"
              aria-checked={formSettings.groupTitleAsHeader}
              onClick={() => updateFormSettings({ groupTitleAsHeader: !formSettings.groupTitleAsHeader })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                formSettings.groupTitleAsHeader ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formSettings.groupTitleAsHeader ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
            <div>
              <label className="text-sm font-medium text-gray-900 block">
                Show Question Numbers
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Displays the assigned number before each question
              </p>
            </div>
            <button
              role="switch"
              aria-checked={formSettings.showQuestionNumbers}
              onClick={() => updateFormSettings({ showQuestionNumbers: !formSettings.showQuestionNumbers })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                formSettings.showQuestionNumbers ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formSettings.showQuestionNumbers ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProperties;