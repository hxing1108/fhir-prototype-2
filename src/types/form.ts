export type FormElementType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date'
  | 'group'
  | 'header'
  | 'image';

export interface FormElementOption {
  value: string;
  label: string;
}

export interface HeaderElement {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  align: 'left' | 'center' | 'right';
  color?: string;
  bold?: boolean;
  italic?: boolean;
}

export interface ImageElement {
  src: string;
  alt: string;
  width: string;
  height: string;
  align: 'left' | 'center' | 'right';
}

export interface IFormElement {
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
  elements?: IFormElement[];
  showTooltip?: boolean;
  tooltipText?: string;
  header?: HeaderElement;
  image?: ImageElement;
}

export interface FormSettings {
  backgroundColor: string;
  textColor: string;
  groupTitleAsHeader: boolean;
  showQuestionNumbers: boolean;
  fontFamily: string;
  fontSize: string;
}