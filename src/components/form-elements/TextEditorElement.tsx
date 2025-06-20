import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';

interface TextEditorElementProps {
  element: IFormElement;
  isPreview?: boolean;
}

const TextEditorElement: React.FC<TextEditorElementProps> = ({
  element,
  isPreview = false,
}) => {
  const { updateElement, formSettings } = useFormContext();

  const handleChange = (content: string) => {
    updateElement(element.id, {
      textEditor: {
        ...element.textEditor,
        content: content,
      },
    });
  };

  // For preview mode, just display the content
  if (isPreview) {
    return (
      <div className="text-editor-preview">
        <div
          className="prose max-w-none text-editor-content"
          style={
            {
              fontFamily: formSettings.fontFamily,
              color: formSettings.textColor,
              fontSize: formSettings.fontSize,
              minHeight: element.textEditor?.height || '200px',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              backgroundColor: formSettings.backgroundColor || '#fff',
              lineHeight: '1.5',
              '--text-color': formSettings.textColor,
              '--font-family': formSettings.fontFamily,
              '--font-size': formSettings.fontSize,
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{
            __html:
              element.textEditor?.content ||
              '<p style="color: #9ca3af;">No content yet...</p>',
          }}
        />
      </div>
    );
  }

  return (
    <div className="text-editor-element">
      <div className="mb-2">
        <label
          className="block text-sm font-medium text-gray-700"
          style={{
            fontFamily: formSettings.fontFamily,
            fontSize: formSettings.fontSize,
            color: formSettings.textColor,
          }}
        >
          {element.label}
          {element.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {element.description && (
          <p
            className="mt-1 text-sm text-gray-500"
            style={{
              fontFamily: formSettings.fontFamily,
              fontSize: `calc(${formSettings.fontSize} * 0.875)`, // Slightly smaller for description
            }}
          >
            {element.description}
          </p>
        )}
      </div>

      <SunEditor
        height={element.textEditor?.height || '200px'}
        placeholder={element.placeholder || 'Enter your content here...'}
        defaultValue={element.textEditor?.content || ''}
        onChange={handleChange}
        setOptions={{
          buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike'],
            ['fontColor', 'hiliteColor'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link', 'image'],
            ['fullScreen', 'showBlocks', 'codeView'],
            ['preview'],
          ],
          mode: 'classic',
          rtl: false,
          imageAccept: '.jpg,.jpeg,.png,.gif,.bmp,.svg',
          imageMultipleFile: false,
          defaultStyle: `
            font-family: ${formSettings.fontFamily || 'Inter'};
            font-size: ${formSettings.fontSize || '16px'};
            color: ${formSettings.textColor || '#111827'};
            background-color: ${formSettings.backgroundColor || '#ffffff'};
            line-height: 1.5;
          `,
          font: [
            'Arial',
            'Comic Sans MS',
            'Courier New',
            'Impact',
            'Georgia',
            'Tahoma',
            'Trebuchet MS',
            'Verdana',
            'Inter',
            'Helvetica',
          ],
          fontSize: [
            8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
          ],
          defaultTag: 'p',
          fontSizeUnit: 'px',
        }}
        setContents={element.textEditor?.content || ''}
        setDefaultStyle={`
          font-family: ${formSettings.fontFamily || 'Inter'};
          font-size: ${formSettings.fontSize || '16px'};
          color: ${formSettings.textColor || '#111827'};
          line-height: 1.5;
        `}
      />

      {element.showTooltip && element.tooltipText && (
        <div
          className="mt-1 text-xs text-gray-500"
          style={{
            fontFamily: formSettings.fontFamily,
            fontSize: `calc(${formSettings.fontSize} * 0.75)`, // Smaller for tooltip
          }}
        >
          💡 {element.tooltipText}
        </div>
      )}
    </div>
  );
};

export default TextEditorElement;
