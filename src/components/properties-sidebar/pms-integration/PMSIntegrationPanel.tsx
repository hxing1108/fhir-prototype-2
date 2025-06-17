import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { VariableSelectionDialog } from './VariableSelectionDialog';

interface PMSIntegrationPanelProps {
  selectedElementId?: string;
  onVariableSave: (elementId: string, content: string) => void;
  savedContent: Record<string, string>;
}

export const PMSIntegrationPanel: React.FC<PMSIntegrationPanelProps> = ({
  selectedElementId,
  onVariableSave,
  savedContent,
}) => {
  const [pmsEnabled, setPmsEnabled] = useState({
    takeover: false,
    output: false,
  });
  const [showVariableDialog, setShowVariableDialog] = useState(false);

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
    if (selectedElementId) {
      onVariableSave(selectedElementId, content);
    }
  };

  return (
    <>
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
                className="p-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 flex items-center"
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
                className="p-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 flex items-center"
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

        {!selectedElementId && (
          <p className="mt-2 text-xs text-gray-500 text-center">
            Select an element to configure PMS settings
          </p>
        )}
      </div>

      {/* Variable Selection Dialog */}
      <VariableSelectionDialog
        key={`${selectedElementId}-${
          savedContent[selectedElementId || ''] || ''
        }`}
        isOpen={showVariableDialog}
        onClose={() => setShowVariableDialog(false)}
        onSave={handleVariableSave}
        initialContent={
          selectedElementId ? savedContent[selectedElementId] || '' : ''
        }
      />
    </>
  );
};
