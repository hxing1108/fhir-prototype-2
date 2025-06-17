import React, { useState, useEffect, useRef } from 'react';

export interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onVariableInsert?: () => void;
}

export const RichTextInput: React.FC<RichTextInputProps> = ({
  value,
  onChange,
  placeholder,
  onVariableInsert,
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string>();

  // Convert content to HTML with pills
  const contentToHtml = (content: string) => {
    const parts = [];
    const regex = /#[^#]+#/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Add text before the variable
      if (match.index > lastIndex) {
        const textPart = content.slice(lastIndex, match.index);
        if (textPart) {
          // Escape HTML in text parts
          const escaped = textPart
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          parts.push(escaped);
        }
      }

      // Add the variable as a pill
      const varName = match[0].replace(/#/g, '').split(':').pop() || match[0];
      parts.push(
        `<span contenteditable="false" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mx-1 select-none" data-variable="${match[0]}">${varName}<button class="variable-delete text-blue-600 hover:text-blue-800" type="button">×</button></span>`
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textPart = content.slice(lastIndex);
      const escaped = textPart
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      parts.push(escaped);
    }

    return parts.join('');
  };

  // Get current cursor position info
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    if (contentEditableRef.current) {
      preCaretRange.selectNodeContents(contentEditableRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
    }

    return {
      offset: preCaretRange.toString().length,
      container: range.endContainer,
      containerOffset: range.endOffset,
    };
  };

  // Restore cursor position
  const restoreCursorPosition = (position: any) => {
    if (
      !position ||
      !contentEditableRef.current ||
      typeof position.offset !== 'number'
    )
      return;

    const selection = window.getSelection();
    if (!selection) return;

    // Validate offset is not negative or invalid
    if (position.offset < 0 || position.offset === 4294967295) return;

    let charCount = 0;

    const traverseNodes = (node: Node): boolean => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (charCount + textLength >= position.offset) {
          const range = document.createRange();
          const targetOffset = Math.max(
            0,
            Math.min(position.offset - charCount, textLength)
          );
          try {
            range.setStart(node, targetOffset);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            return true;
          } catch (error) {
            console.warn('Failed to restore cursor position:', error);
            return false;
          }
        }
        charCount += textLength;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip pill elements
        const element = node as HTMLElement;
        if (element.hasAttribute('data-variable')) {
          charCount += 1; // Count as one character for cursor positioning
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            if (traverseNodes(node.childNodes[i])) return true;
          }
        }
      }
      return false;
    };

    try {
      traverseNodes(contentEditableRef.current);
    } catch (error) {
      console.warn('Error in cursor position restoration:', error);
    }
  };

  // Convert HTML back to content string
  const htmlToContent = () => {
    if (!contentEditableRef.current) return '';

    let result = '';
    const traverseNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.hasAttribute('data-variable')) {
          result += element.getAttribute('data-variable') || '';
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            traverseNodes(node.childNodes[i]);
          }
        }
      }
    };

    traverseNodes(contentEditableRef.current);
    return result;
  };

  // Initial render and content updates
  useEffect(() => {
    if (contentEditableRef.current && value !== lastValueRef.current) {
      const cursorPos = saveCursorPosition();
      const htmlContent = contentToHtml(value);
      contentEditableRef.current.innerHTML = htmlContent;

      // Only restore cursor position if we had a valid previous position
      // and this isn't the initial load
      if (cursorPos && lastValueRef.current !== undefined) {
        setTimeout(() => restoreCursorPosition(cursorPos), 0);
      }

      lastValueRef.current = value;
    }
  }, [value]);

  const handleInput = () => {
    const newContent = htmlToContent();
    if (newContent !== lastValueRef.current) {
      lastValueRef.current = newContent;
      onChange(newContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Check if we're at the start of a text node right after a pill
        if (range.collapsed && range.startOffset === 0) {
          const node = range.startContainer;
          const prevSibling = node.previousSibling;

          if (prevSibling && prevSibling.nodeType === Node.ELEMENT_NODE) {
            const element = prevSibling as HTMLElement;
            if (element.hasAttribute('data-variable')) {
              e.preventDefault();
              const cursorPos = saveCursorPosition();
              element.remove();
              handleInput();
              setTimeout(() => restoreCursorPosition(cursorPos), 0);
            }
          }
        }
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('variable-delete')) {
      e.preventDefault();
      const pill = target.closest('[data-variable]');
      if (pill) {
        const cursorPos = saveCursorPosition();
        pill.remove();
        handleInput();
        setTimeout(() => restoreCursorPosition(cursorPos), 0);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
      selection.collapseToEnd();
      handleInput();
    }
  };

  return (
    <div className="relative">
      <div
        ref={contentEditableRef}
        contentEditable
        className="input min-h-[120px] overflow-auto whitespace-pre-wrap leading-loose"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};
