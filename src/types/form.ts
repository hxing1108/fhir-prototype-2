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
  | 'quantity';

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
