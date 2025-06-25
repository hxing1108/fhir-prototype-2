import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { VisibilityConfigDialog } from './VisibilityConfigDialog';
import { VisibilitySettings } from '../../../types/form';

interface VisibilityPanelProps {
  selectedElementId?: string;
  visibilitySettings?: VisibilitySettings;
  onVisibilityChange: (elementId: string, settings: VisibilitySettings) => void;
}

export const VisibilityPanel: React.FC<VisibilityPanelProps> = ({
  selectedElementId,
  visibilitySettings,
  onVisibilityChange,
}) => {
  const [visibilityEnabled, setVisibilityEnabled] = useState(
    visibilitySettings?.enabled || false
  );
  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleToggleVisibility = () => {
    const newEnabled = !visibilityEnabled;
    setVisibilityEnabled(newEnabled);
    
    if (selectedElementId) {
      const newSettings: VisibilitySettings = {
        enabled: newEnabled,
        rules: visibilitySettings?.rules || [],
        defaultAction: visibilitySettings?.defaultAction || 'show',
      };
      
      if (newEnabled && newSettings.rules.length === 0) {
        // When enabling for the first time, open dialog to configure
        setShowVisibilityDialog(true);
      }
      
      onVisibilityChange(selectedElementId, newSettings);
    }
  };

  const handleOpenVisibilityDialog = () => {
    setShowVisibilityDialog(true);
  };

  const handleVisibilitySave = (settings: VisibilitySettings) => {
    if (selectedElementId) {
      onVisibilityChange(selectedElementId, settings);
    }
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const hasVisibilityRules = visibilitySettings?.rules && visibilitySettings.rules.length > 0;

  return (
    <>
      <div
        className="border-t border-gray-200"
        data-testid="visibility-panel"
      >
        {/* Accordion Header */}
        <button
          onClick={toggleAccordion}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
        >
          <h4 className="text-sm font-medium text-gray-700">
            Visibility
          </h4>
          {isAccordionOpen ? (
            <ChevronDown size={16} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-500" />
          )}
        </button>

        {/* Accordion Content */}
        {isAccordionOpen && (
          <div className="px-4 pb-4 space-y-3">
            {/* Conditional Logic Toggle */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Conditional Logic
              </span>
              <div className="flex items-center space-x-3">
                {visibilityEnabled && (
                  <div className="relative">
                    <button
                      onClick={handleOpenVisibilityDialog}
                      className="p-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 flex items-center"
                      title="Edit Visibility Rules"
                    >
                      <ExternalLink size={16} />
                    </button>
                    {/* Notification dot when rules are configured */}
                    {hasVisibilityRules && (
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#78AAFF' }}
                      ></div>
                    )}
                  </div>
                )}
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={visibilityEnabled}
                    onChange={handleToggleVisibility}
                  />
                  <div className="toggle-switch-track">
                    <div className="toggle-switch-thumb"></div>
                  </div>
                </label>
              </div>
            </div>

            {!selectedElementId && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                Select an element to configure visibility
              </p>
            )}
          </div>
        )}
      </div>

      {/* Visibility Configuration Dialog */}
      <VisibilityConfigDialog
        isOpen={showVisibilityDialog}
        onClose={() => setShowVisibilityDialog(false)}
        onSave={handleVisibilitySave}
        initialSettings={visibilitySettings}
        currentElementId={selectedElementId}
      />
    </>
  );
}; 