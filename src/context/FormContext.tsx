import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  IFormElement,
  FormElementType,
  FormSettings,
  FormMetadata,
} from '../types/form';
import { FHIRExportService } from '../services/FHIRExportService';
import { FHIRResponseExportService } from '../services/FHIRResponseExportService';
import { FHIRQuestionnaire, FHIRQuestionnaireResponse } from '../types/fhir';

interface FormContextType {
  elements: IFormElement[];
  addElement: (type: FormElementType, parentId?: string) => IFormElement;
  updateElement: (id: string, updates: Partial<IFormElement>) => void;
  removeElement: (id: string) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  moveElement: (fromIndex: number, toIndex: number) => void;
  moveElementInGroup: (
    groupId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  previewMode: boolean;
  togglePreviewMode: () => void;
  formSettings: FormSettings;
  updateFormSettings: (updates: Partial<FormSettings>) => void;
  formMetadata: FormMetadata;
  updateFormMetadata: (updates: Partial<FormMetadata>) => void;
  formData: Record<string, any>;
  updateFormData: (id: string, value: any) => void;
  exportToFHIRQuestionnaire: () => FHIRQuestionnaire;
  exportToFHIRQuestionnaireResponse: () => FHIRQuestionnaireResponse;
}

const defaultFormSettings: FormSettings = {
  backgroundColor: '#ffffff',
  textColor: '#111827',
  groupTitleAsHeader: true,
  showQuestionNumbers: true,
  fontFamily: 'Inter',
  fontSize: '16px',
};

const defaultFormMetadata: FormMetadata = {
  status: 'draft',
  title: 'New Questionnaire',
  date: new Date().toISOString().split('T')[0],
};

const defaultFormContext: FormContextType = {
  elements: [],
  addElement: () => ({ id: '', type: 'text', label: '', required: false }),
  updateElement: () => {},
  removeElement: () => {},
  selectedElementId: null,
  setSelectedElementId: () => {},
  moveElement: () => {},
  moveElementInGroup: () => {},
  previewMode: false,
  togglePreviewMode: () => {},
  formSettings: defaultFormSettings,
  updateFormSettings: () => {},
  formMetadata: defaultFormMetadata,
  updateFormMetadata: () => {},
  formData: {},
  updateFormData: () => {},
  exportToFHIRQuestionnaire: () => ({
    resourceType: 'Questionnaire',
    status: 'draft',
    item: [],
  }),
  exportToFHIRQuestionnaireResponse: () => ({
    resourceType: 'QuestionnaireResponse',
    status: 'completed',
    questionnaire: '',
    item: [],
  }),
};

const FormContext = createContext<FormContextType>(defaultFormContext);

export const useFormContext = () => useContext(FormContext);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [elements, setElements] = useState<IFormElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [formSettings, setFormSettings] =
    useState<FormSettings>(defaultFormSettings);
  const [formMetadata, setFormMetadata] =
    useState<FormMetadata>(defaultFormMetadata);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Initialize FHIR export services
  const fhirExportService = new FHIRExportService();
  const fhirResponseExportService = new FHIRResponseExportService();

  const addElement = (
    type: FormElementType,
    parentId?: string
  ): IFormElement => {
    const newElement: IFormElement = {
      id: uuidv4(),
      type,
      label: getDefaultLabel(type),
      required: false,
      placeholder: getDefaultPlaceholder(type),
      options:
        type === 'select' || type === 'radio' || type === 'checkbox'
          ? [
              { value: 'Option 1', label: 'Option 1' },
              { value: 'Option 2', label: 'Option 2' },
            ]
          : [],
      elements: type === 'group' ? [] : undefined,
      header: type === 'header' ? { level: 2, align: 'left' } : undefined,
      image:
        type === 'image'
          ? { src: '', alt: '', width: '100%', height: 'auto', align: 'left' }
          : undefined,
      yesLabel: type === 'yesNo' ? 'Yes' : undefined,
      noLabel: type === 'yesNo' ? 'No' : undefined,
      defaultValue:
        type === 'yesNo' ? undefined : type === 'checkbox' ? [] : undefined,
    };

    if (parentId) {
      setElements(
        elements.map((element) => {
          if (element.id === parentId) {
            return {
              ...element,
              elements: [...(element.elements || []), newElement],
            };
          }
          return element;
        })
      );
    } else {
      setElements([...elements, newElement]);
    }

    setSelectedElementId(newElement.id);
    return newElement;
  };

  const updateElement = (id: string, updates: Partial<IFormElement>) => {
    const updateElementRecursive = (
      elements: IFormElement[]
    ): IFormElement[] => {
      return elements.map((element) => {
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
    const removeElementRecursive = (
      elements: IFormElement[]
    ): IFormElement[] => {
      return elements.filter((element) => {
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

  const moveElementInGroup = (
    groupId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    setElements((prevElements) => {
      const newElements = [...prevElements];
      const updateGroupElements = (
        currentElements: IFormElement[]
      ): IFormElement[] => {
        return currentElements.map((el) => {
          if (el.id === groupId && el.elements) {
            const groupElements = [...el.elements];
            const [removed] = groupElements.splice(fromIndex, 1);
            groupElements.splice(toIndex, 0, removed);
            return { ...el, elements: groupElements };
          }
          return el;
        });
      };
      return updateGroupElements(newElements);
    });
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    setSelectedElementId(null);
  };

  const updateFormSettings = (updates: Partial<FormSettings>) =>
    setFormSettings({ ...formSettings, ...updates });

  const updateFormMetadata = (updates: Partial<FormMetadata>) =>
    setFormMetadata({ ...formMetadata, ...updates });

  const getDefaultLabel = (type: FormElementType): string => {
    switch (type) {
      case 'text':
        return 'Text Field';
      case 'textarea':
        return 'Text Area';
      case 'number':
        return 'Number Field';
      case 'email':
        return 'Email Field';
      case 'select':
        return 'Dropdown';
      case 'checkbox':
        return 'Checkbox Group';
      case 'radio':
        return 'Radio Group';
      case 'date':
        return 'Date Field';
      case 'group':
        return 'Question Group';
      case 'header':
        return 'Header';
      case 'image':
        return '';
      case 'yesNo':
        return 'Yes/No Question';
      case 'dateTime':
        return 'Date Time Field';
      case 'time':
        return 'Time Field';
      case 'attachment':
        return 'Attachment Field';
      case 'reference':
        return 'Reference Field';
      case 'quantity':
        return 'Quantity Field';
      default:
        return 'New Field';
    }
  };

  const getDefaultPlaceholder = (type: FormElementType): string => {
    switch (type) {
      case 'text':
        return 'Enter text...';
      case 'textarea':
        return 'Enter long text...';
      case 'number':
        return 'Enter a number...';
      case 'email':
        return 'Enter your email...';
      case 'date':
        return 'Select a date...';
      case 'dateTime':
        return 'Select a date and time...';
      case 'time':
        return 'Select a time...';
      case 'header':
        return 'Enter heading text...';
      case 'yesNo':
        return 'Enter your question here...';
      case 'attachment':
        return 'Add an attachment...';
      case 'reference':
        return 'Select a reference...';
      case 'quantity':
        return 'Enter a quantity...';
      default:
        return '';
    }
  };

  const updateFormData = (id: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const exportToFHIRQuestionnaire = (): FHIRQuestionnaire => {
    return fhirExportService.toQuestionnaire(elements, formMetadata);
  };

  const exportToFHIRQuestionnaireResponse = (): FHIRQuestionnaireResponse => {
    return fhirResponseExportService.toQuestionnaireResponse(
      formData,
      elements,
      formMetadata
    );
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
        moveElementInGroup,
        previewMode,
        togglePreviewMode,
        formSettings,
        updateFormSettings,
        formMetadata,
        updateFormMetadata,
        formData,
        updateFormData,
        exportToFHIRQuestionnaire,
        exportToFHIRQuestionnaireResponse,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
