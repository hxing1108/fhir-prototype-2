import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormElement, FormElementType, FormSettings } from '../types/form';

interface FormContextType {
  elements: FormElement[];
  addElement: (type: FormElementType, parentId?: string) => FormElement;
  updateElement: (id: string, updates: Partial<FormElement>) => void;
  removeElement: (id: string) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  moveElement: (fromIndex: number, toIndex: number) => void;
  previewMode: boolean;
  togglePreviewMode: () => void;
  formSettings: FormSettings;
  updateFormSettings: (updates: Partial<FormSettings>) => void;
}

const defaultFormSettings: FormSettings = {
  backgroundColor: '#ffffff',
  textColor: '#111827',
  groupTitleAsHeader: true,
  showQuestionNumbers: true,
  fontFamily: 'Inter',
  fontSize: '16px',
};

const defaultFormContext: FormContextType = {
  elements: [],
  addElement: () => ({ id: '', type: 'text', label: '', required: false }),
  updateElement: () => {},
  removeElement: () => {},
  selectedElementId: null,
  setSelectedElementId: () => {},
  moveElement: () => {},
  previewMode: false,
  togglePreviewMode: () => {},
  formSettings: defaultFormSettings,
  updateFormSettings: () => {},
};

const FormContext = createContext<FormContextType>(defaultFormContext);

export const useFormContext = () => useContext(FormContext);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<FormElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formSettings, setFormSettings] = useState<FormSettings>(defaultFormSettings);

  const addElement = (type: FormElementType, parentId?: string): FormElement => {
    const newElement: FormElement = {
      id: uuidv4(),
      type,
      label: getDefaultLabel(type),
      required: false,
      placeholder: getDefaultPlaceholder(type),
      options: type === 'select' || type === 'radio' || type === 'checkbox' 
        ? [{ value: 'Option 1', label: 'Option 1' }, { value: 'Option 2', label: 'Option 2' }] 
        : [],
      elements: type === 'group' ? [] : undefined,
      header: type === 'header' ? { level: 2, align: 'left' } : undefined,
      richtext: type === 'richtext' ? { content: [{ type: 'paragraph', children: [{ text: '' }] }], align: 'left' } : undefined,
    };
    
    if (parentId) {
      setElements(elements.map(element => {
        if (element.id === parentId) {
          return {
            ...element,
            elements: [...(element.elements || []), newElement],
          };
        }
        return element;
      }));
    } else {
      setElements([...elements, newElement]);
    }
    
    setSelectedElementId(newElement.id);
    return newElement;
  };

  const updateElement = (id: string, updates: Partial<FormElement>) => {
    const updateElementRecursive = (elements: FormElement[]): FormElement[] => {
      return elements.map(element => {
        if (element.id === id) {
          return { ...element, ...updates };
        }
        if (element.elements) {
          return {
            ...element,
            elements: updateElementRecursive(element.elements),
          };
        }
        return element;
      });
    };

    setElements(updateElementRecursive(elements));
  };

  const removeElement = (id: string) => {
    const removeElementRecursive = (elements: FormElement[]): FormElement[] => {
      return elements.filter(element => {
        if (element.id === id) {
          return false;
        }
        if (element.elements) {
          element.elements = removeElementRecursive(element.elements);
        }
        return true;
      });
    };

    setElements(removeElementRecursive(elements));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const moveElement = (fromIndex: number, toIndex: number) => {
    const newElements = [...elements];
    const [removed] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, removed);
    setElements(newElements);
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    setSelectedElementId(null);
  };

  const updateFormSettings = (updates: Partial<FormSettings>) => {
    setFormSettings({ ...formSettings, ...updates });
  };

  // Helper functions
  const getDefaultLabel = (type: FormElementType): string => {
    switch(type) {
      case 'text': return 'Text Field';
      case 'textarea': return 'Text Area';
      case 'number': return 'Number Field';
      case 'email': return 'Email Field';
      case 'select': return 'Dropdown';
      case 'checkbox': return 'Checkbox Group';
      case 'radio': return 'Radio Group';
      case 'date': return 'Date Field';
      case 'group': return 'Question Group';
      case 'header': return 'Header';
      case 'richtext': return '';
      default: return 'New Field';
    }
  };
  
  const getDefaultPlaceholder = (type: FormElementType): string => {
    switch(type) {
      case 'text': return 'Enter text...';
      case 'textarea': return 'Enter long text...';
      case 'number': return 'Enter a number...';
      case 'email': return 'Enter your email...';
      case 'date': return 'Select a date...';
      case 'header': return 'Enter heading text...';
      case 'richtext': return 'Enter text here...';
      default: return '';
    }
  };

  return (
    <FormContext.Provider
      value={{
        elements,
        addElement,
        updateElement,
        removeElement,
        selectedElementId,
        setSelectedElementId,
        moveElement,
        previewMode,
        togglePreviewMode,
        formSettings,
        updateFormSettings,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};