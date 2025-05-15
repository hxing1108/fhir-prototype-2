export type FormElementType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date'
  | 'group';

export interface FormElementOption {
  value: string;
  label: string;
}

export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FormElementOption[];
  defaultValue?: string | string[] | number;
  description?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  elements?: FormElement[]; // For group elements
  showTooltip?: boolean;
  tooltipText?: string;
}

export interface FormSettings {
  backgroundColor: string;
  textColor: string;
  groupTitleAsHeader: boolean;
  showQuestionNumbers: boolean;
  fontFamily: string;
  fontSize: string;
}