import React, { useState, useEffect } from 'react';
import { IFormElement, HeaderElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

interface HeaderPropertiesProps {
  element: IFormElement;
}

// Map heading levels to font size classes (Tailwind example)
// const fontSizeMap: Record<string, string> = {
//   h1: 'text-4xl', // Example for H1
//   h2: 'text-3xl', // Example for H2
//   h3: 'text-2xl', // Example for H3
//   h4: 'text-xl',  // Example for H4
//   h5: 'text-lg',  // Example for H5
//   h6: 'text-base',// Example for H6
// }; Not directly used for now as select values are 'h1', 'h2' etc.

const defaultFontSizeKey = 'h3'; // Default to H3 equivalent size (key for select)

const HeaderProperties: React.FC<HeaderPropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();
  const [displayMode, setDisplayMode] = useState(element.header?.displayMode || 'heading');

  useEffect(() => {
    setDisplayMode(element.header?.displayMode || 'heading');
  }, [element.header?.displayMode]);

  const handleModeChange = (mode: 'heading' | 'richtext') => {
    setDisplayMode(mode);
    updateElement(element.id, {
      header: {
        fontSize: getCurrentHeader().fontSize, // Preserve existing or default fontSize
        align: getCurrentHeader().align,       // Preserve existing or default align
        color: getCurrentHeader().color,       // Preserve existing color
        bold: getCurrentHeader().bold,         // Preserve existing bold
        italic: getCurrentHeader().italic,     // Preserve existing italic
        ...(element.header),                 // Spread existing header to keep any other props
        displayMode: mode                    // Update displayMode
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateElement(element.id, { [e.target.name]: e.target.value });
  };

  const handleHeaderChange = (field: keyof HeaderElement, value: any) => {
    const current = getCurrentHeader();
    updateElement(element.id, {
      header: {
        ...current, // Spread current state with all defaults
        [field]: value
      }
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleHeaderChange('fontSize', e.target.value);
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    handleHeaderChange('align', alignment);
  };

  const handleColorChange = (color: string) => {
    handleHeaderChange('color', color);
  };

  const toggleStyle = (style: 'bold' | 'italic') => {
    const current = getCurrentHeader();
    handleHeaderChange(style, !current[style]);
  };

  // Function to get current header properties with defaults
  const getCurrentHeader = (): HeaderElement & { 
                                displayMode: 'heading' | 'richtext'; 
                                fontSize: string; 
                                align: 'left' | 'center' | 'right'; 
                                bold: boolean; 
                                italic: boolean; 
                              } => {
    const eh = element.header; // Alias for element.header
    return {
      displayMode: eh?.displayMode || 'heading',
      fontSize: eh?.fontSize || defaultFontSizeKey,
      align: eh?.align || 'left',
      color: eh?.color, // color is optional in HeaderElement and can remain so
      bold: typeof eh?.bold === 'boolean' ? eh.bold : false,
      italic: typeof eh?.italic === 'boolean' ? eh.italic : false,
    };
  };
  
  const currentHeader = getCurrentHeader();

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Display Mode</label>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1 w-full">
          <button
            type="button"
            onClick={() => handleModeChange('heading')}
            className={`flex-1 p-1.5 text-sm rounded-md ${
              displayMode === 'heading' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Heading
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('richtext')}
            className={`flex-1 p-1.5 text-sm rounded-md ${
              displayMode === 'richtext' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Rich Text
          </button>
        </div>
      </div>

      {/* Shared Content Input */}
      <div>
        <label className="label">
          {displayMode === 'heading' ? 'Heading Text' : 'Rich Text Content (HTML)'}
        </label>
        <textarea
          name="label" // Updates element.label directly
          value={element.label || ''}
          onChange={handleChange}
          className="input"
          rows={displayMode === 'heading' ? 2 : 5} // Adjust rows based on mode
          placeholder={displayMode === 'heading' ? 'Enter heading text...' : 'Enter HTML content...'}
        />
      </div>

      {/* Font Size Control (replaces Heading Level) - Only for 'heading' mode */}
      {displayMode === 'heading' && (
        <div>
          <label className="label">Font Size</label>
          <select
            value={currentHeader.fontSize}
            onChange={handleFontSizeChange}
            className="input"
          >
            <option value="h1">Heading 1</option> 
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
        </div>
      )}

      {/* Text Color - Always Visible */}
      <div>
        <label className="label">Text Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={currentHeader.color || '#000000'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-8 w-8 rounded border border-gray-300"
          />
          <input
            type="text"
            value={currentHeader.color || '#000000'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="input flex-1"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Text Style - Always Visible */}
      <div>
        <label className="label">Text Style</label>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md">
          <button
            type="button"
            onClick={() => toggleStyle('bold')}
            className={`p-2 ${currentHeader.bold ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => toggleStyle('italic')}
            className={`p-2 ${currentHeader.italic ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <Italic size={16} />
          </button>
        </div>
      </div>

      {/* Text Alignment - Always Visible */}
      <div>
        <label className="label">Text Alignment</label>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md">
          <button
            type="button"
            onClick={() => handleAlignmentChange('left')}
            className={`p-2 ${currentHeader.align === 'left' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleAlignmentChange('center')}
            className={`p-2 ${currentHeader.align === 'center' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleAlignmentChange('right')}
            className={`p-2 ${currentHeader.align === 'right' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignRight size={16} />
          </button>
        </div>
      </div>
      

    </div>
  );
};

export default HeaderProperties;