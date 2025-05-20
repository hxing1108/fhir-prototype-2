import React from 'react';
import { useFormContext } from '../../context/FormContext';

const FormProperties: React.FC = () => {
  const { formSettings, updateFormSettings } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Form Appearance
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formSettings.backgroundColor}
                onChange={(e) =>
                  updateFormSettings({ backgroundColor: e.target.value })
                }
                className="h-8 w-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={formSettings.backgroundColor}
                onChange={(e) =>
                  updateFormSettings({ backgroundColor: e.target.value })
                }
                className="input flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formSettings.textColor}
                onChange={(e) =>
                  updateFormSettings({ textColor: e.target.value })
                }
                className="h-8 w-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={formSettings.textColor}
                onChange={(e) =>
                  updateFormSettings({ textColor: e.target.value })
                }
                className="input flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Font Family
            </label>
            <select
              value={formSettings.fontFamily}
              onChange={(e) =>
                updateFormSettings({ fontFamily: e.target.value })
              }
              className="input text-sm"
            >
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Font Size
            </label>
            <select
              value={formSettings.fontSize}
              onChange={(e) => updateFormSettings({ fontSize: e.target.value })}
              className="input text-sm"
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="18px">Large (18px)</option>
              <option value="20px">Extra Large (20px)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block">
                Display Group Title as Header
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Visually styles the group's title text as a prominent header
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={formSettings.groupTitleAsHeader}
                onChange={() =>
                  updateFormSettings({
                    groupTitleAsHeader: !formSettings.groupTitleAsHeader,
                  })
                }
              />
              <div className="toggle-switch-track">
                <div className="toggle-switch-thumb"></div>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block">
                Show Question Numbers
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Displays the assigned number before each question
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={formSettings.showQuestionNumbers}
                onChange={() =>
                  updateFormSettings({
                    showQuestionNumbers: !formSettings.showQuestionNumbers,
                  })
                }
              />
              <div className="toggle-switch-track">
                <div className="toggle-switch-thumb"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProperties;
