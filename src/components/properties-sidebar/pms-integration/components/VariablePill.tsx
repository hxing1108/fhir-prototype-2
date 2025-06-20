import React from 'react';
import { X } from 'lucide-react';

interface VariablePillProps {
  variable: string;
  onRemove: () => void;
}

export const VariablePill: React.FC<VariablePillProps> = ({
  variable,
  onRemove,
}) => {
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
