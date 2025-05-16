import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface HeaderElementProps {
  element: IFormElement;
}

// Mapping from fontSize keys to Tailwind CSS classes
const fontSizeKeyToClassMap: Record<string, string> = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-lg',
  h6: 'text-base',
};
const defaultFontSizeKey = 'h3'; // Corresponds to text-2xl
const defaultRawFontSizeClass = fontSizeKeyToClassMap[defaultFontSizeKey];

const HeaderElement: React.FC<HeaderElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();

  const headerConfig = element.header;
  const displayMode = headerConfig?.displayMode || 'heading';
  const fontSizeKey = headerConfig?.fontSize || defaultFontSizeKey;
  const fontSizeClass = displayMode === 'heading' 
                        ? (fontSizeKeyToClassMap[fontSizeKey] || defaultRawFontSizeClass) 
                        : ''; // No specific font size class for rich text mode

  const headerStyles: React.CSSProperties = {
    textAlign: headerConfig?.align || 'left',
    color: headerConfig?.color, // Will be undefined if not set, CSS handles default
    fontStyle: headerConfig?.italic ? 'italic' : 'normal',
    fontWeight: headerConfig?.bold ? 'bold' : 'normal',
    width: '100%', // Ensure it takes full width for alignment to work
    wordWrap: 'break-word',
    overflowWrap: 'break-word', 
    // whiteSpace: 'pre-wrap', // pre-wrap might conflict with HTML rendering, adjust if needed
  };

  if (displayMode === 'richtext') {
    // For rich text, render the HTML content directly.
    // The textarea for direct editing on canvas is not shown for rich text.
    // Editing happens in the properties panel.
    return (
      <div
        className={`w-full ${fontSizeClass}`}
        style={headerStyles}
        dangerouslySetInnerHTML={{ __html: element.label || '' }}
      />
    );
  }

  // Default to 'heading' mode: editable textarea
  // Apply most styles to the textarea itself for direct visual feedback while editing.
  const editableTextareaStyles: React.CSSProperties = {
    ...headerStyles, // Inherit color, alignment, bold, italic
    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    resize: 'none',
    overflow: 'hidden',
    padding: 0, // Remove default padding
    margin: 0, // Remove default margin
    // whiteSpace: 'pre-wrap', // Keep for textarea if desired for line breaks
  };

  return (
    <div className={`w-full ${fontSizeClass}`} style={{ textAlign: headerStyles.textAlign }} >
      {/* The outer div handles overall text-align and font size class. */}
      {/* The textarea itself will inherit color, and apply bold/italic. */}
      <textarea
        value={element.label || ''}
        onChange={(e) => updateElement(element.id, { label: e.target.value })}
        className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 resize-none overflow-hidden whitespace-pre-wrap break-words"
        placeholder="Enter heading text..."
        rows={1}
        style={editableTextareaStyles}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
    </div>
  );
};

export default HeaderElement;