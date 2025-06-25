import { FHIRCoding, FHIREnableWhen } from './fhir';

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
  | 'image'
  | 'yesNo'
  | 'dateTime'
  | 'time'
  | 'attachment'
  | 'reference'
  | 'quantity'
  | 'textEditor';

export interface FormElementOption {
  value: string;
  label: string;
  showOptionTooltip?: boolean;
  optionTooltipText?: string;
}

export interface HeaderElement {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  fontSize?: string;
  displayMode?: 'heading' | 'richtext';
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

export interface TextEditorElement {
  content: string;
  height?: string;
  showToolbar?: boolean;
}

export interface GDTAnswerMapping {
  answerValue: string;
  gdtCode: string;
  description?: string;
}

export interface AcroFieldMapping {
  inputInstruction?: string;
  outputInstruction?: string;
  defaultGDTCode?: string;
  answerMappings?: GDTAnswerMapping[];
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
  textEditor?: TextEditorElement;
  yesLabel?: string;
  noLabel?: string;
  allowFreeText?: boolean;
  freeTextLabel?: string;
  freeTextValue?: string;
  linkId?: string;
  code?: FHIRCoding[];
  enableWhen?: EnableWhen[];
  answerValueSet?: string;
  prefix?: string;
  readOnly?: boolean;
  maxOccurs?: number;
  fhirType?: string;
  definition?: string;
  repeats?: boolean;
  acroField?: AcroFieldMapping;
  visibility?: VisibilitySettings;
}

export interface EnableWhen {
  question: string;
  operator: string;
  answerBoolean?: boolean;
  answerDecimal?: number;
  answerInteger?: number;
  answerDate?: string;
  answerDateTime?: string;
  answerTime?: string;
  answerString?: string;
  answerCoding?: FHIRCoding;
}

export interface VisibilityCondition {
  id: string;
  sourceFieldId: string;        // Which field to check
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'is_empty' | 'is_not_empty' | 'greater_than' | 'less_than';
  value?: string | number | boolean;  // The value to compare against
  logic: 'AND' | 'OR';         // Logic connector for multiple conditions
}

export interface VisibilityRule {
  id: string;
  conditions: VisibilityCondition[];
  action: 'show' | 'hide';     // What to do when conditions are met
  targetType: 'next_question' | 'specific_question' | 'end_form';
  targetQuestionId?: string;   // For specific question targeting
}

export interface VisibilitySettings {
  enabled: boolean;
  rules: VisibilityRule[];
  defaultAction: 'show' | 'hide';  // What to do when no rules match
}

export interface FormSettings {
  backgroundColor: string;
  textColor: string;
  groupTitleAsHeader: boolean;
  showQuestionNumbers: boolean;
  fontFamily: string;
  fontSize: string;
}

export interface FormMetadata {
  id?: string;
  url?: string;
  status?: 'draft' | 'active' | 'retired' | 'unknown';
  title?: string;
  version?: string;
  publisher?: string;
  description?: string;
  date?: string;
}
