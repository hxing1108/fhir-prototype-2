import React, { useMemo, useCallback } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link
} from 'lucide-react';

interface RichTextElementProps {
  element: FormElement;
}

const RichTextElement: React.FC<RichTextElementProps> = ({ element }) => {
  const { updateElement, formSettings } = useFormContext();
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue: Descendant[] = useMemo(() => {
    return element.richtext?.content ? element.richtext.content : [{
      type: 'paragraph',
      children: [{ text: '' }],
    }];
  }, [element.richtext?.content]);

  const Toolbar = () => {
    const editor = useSlate();
    
    const ToolbarButton = ({ format, icon: Icon, isBlock = false }: any) => {
      return (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            if (isBlock) {
              Transforms.setNodes(editor, { type: format });
            } else {
              const isActive = isFormatActive(editor, format);
              Transforms.setNodes(
                editor,
                { [format]: !isActive },
                { match: (n) => Editor.isText(n), split: true }
              );
            }
          }}
          className={`p-2 hover:bg-gray-50 ${isFormatActive(editor, format) ? 'bg-gray-100' : ''}`}
        >
          <Icon size={16} />
        </button>
      );
    };

    return (
      <div className="flex items-center gap-1 mb-2 border border-gray-200 rounded-md divide-x">
        <div className="flex items-center">
          <ToolbarButton format="bold" icon={Bold} />
          <ToolbarButton format="italic" icon={Italic} />
          <ToolbarButton format="underline" icon={Underline} />
        </div>
        
        <div className="flex items-center">
          <ToolbarButton format="bulleted-list" icon={List} isBlock />
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => updateElement(element.id, { richtext: { ...element.richtext!, align: 'left' } })}
            className={`p-2 ${element.richtext?.align === 'left' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => updateElement(element.id, { richtext: { ...element.richtext!, align: 'center' } })}
            className={`p-2 ${element.richtext?.align === 'center' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => updateElement(element.id, { richtext: { ...element.richtext!, align: 'right' } })}
            className={`p-2 ${element.richtext?.align === 'right' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => updateElement(element.id, { richtext: { ...element.richtext!, align: 'justify' } })}
            className={`p-2 ${element.richtext?.align === 'justify' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignJustify size={16} />
          </button>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              const url = window.prompt('Enter the URL:');
              if (url) {
                editor.insertText(url);
                Transforms.setNodes(
                  editor,
                  { link: url },
                  { match: (n) => Editor.isText(n), split: true }
                );
              }
            }}
            className="p-2 hover:bg-gray-50"
          >
            <Link size={16} />
          </button>
        </div>
      </div>
    );
  };

  const isFormatActive = (editor: Editor, format: string) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => n[format] === true,
      mode: 'all',
    });
    return !!match;
  };

  const handleChange = (value: Descendant[]) => {
    updateElement(element.id, {
      richtext: { ...element.richtext!, content: value }
    });
  };

  const style = {
    fontFamily: formSettings.fontFamily,
    color: formSettings.textColor,
    textAlign: element.richtext?.align || 'left',
  };

  return (
    <div className="rich-text-editor">
      <Slate editor={editor} value={initialValue} onChange={handleChange}>
        <Toolbar />
        <div style={style}>
          <Editable
            className="min-h-[100px] p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D2D85] focus:border-transparent"
            placeholder="Enter text here..."
            renderElement={useCallback((props) => {
              switch (props.element.type) {
                case 'bulleted-list':
                  return <ul {...props.attributes}>{props.children}</ul>;
                default:
                  return <p {...props.attributes}>{props.children}</p>;
              }
            }, [])}
            renderLeaf={useCallback((props) => {
              let { children } = props;
              if (props.leaf.bold) {
                children = <strong>{children}</strong>;
              }
              if (props.leaf.italic) {
                children = <em>{children}</em>;
              }
              if (props.leaf.underline) {
                children = <u>{children}</u>;
              }
              if (props.leaf.link) {
                children = <a href={props.leaf.link} className="text-blue-600 hover:underline">{children}</a>;
              }
              return <span {...props.attributes}>{children}</span>;
            }, [])}
          />
        </div>
      </Slate>
    </div>
  );
};

export default RichTextElement;