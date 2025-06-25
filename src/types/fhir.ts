/**
 * FHIR Resource Type Definitions
 * These types are based on the FHIR specification and are used to represent
 * FHIR resources in the form editor.
 */

export interface FHIRIdentifier {
  system?: string;
  value?: string;
}

export interface FHIRCoding {
  system: string;
  code: string;
  display?: string;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

export interface FHIRPeriod {
  start?: string;
  end?: string;
}

export interface FHIRUsageContext {
  code: FHIRCoding;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueQuantity?: any;
  valueRange?: any;
  valueReference?: FHIRReference;
}

export interface FHIRReference {
  reference?: string;
  type?: string;
  display?: string;
}

export interface FHIREnableWhen {
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

export interface FHIRAnswerOption {
  valueCoding?: FHIRCoding;
  valueString?: string;
  valueInteger?: number;
  valueDate?: string;
  valueTime?: string;
  valueReference?: FHIRReference;
}

export interface FHIRInitial {
  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueUri?: string;
  valueAttachment?: any;
  valueCoding?: FHIRCoding;
  valueQuantity?: any;
  valueReference?: FHIRReference;
}

/**
 * Represents a FHIR Questionnaire resource
 */
export interface FHIRQuestionnaire {
  resourceType: 'Questionnaire';
  id?: string;
  url?: string;
  identifier?: FHIRIdentifier[];
  version?: string;
  name?: string;
  title?: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  experimental?: boolean;
  date?: string;
  publisher?: string;
  description?: string;
  useContext?: FHIRUsageContext[];
  jurisdiction?: FHIRCodeableConcept[];
  purpose?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: FHIRPeriod;
  code?: FHIRCoding[];
  item?: FHIRQuestionnaireItem[];
}

/**
 * Represents a FHIR QuestionnaireItem
 */
export interface FHIRQuestionnaireItem {
  linkId: string;
  definition?: string;
  code?: FHIRCoding[];
  prefix?: string;
  text?: string;
  type: string;
  enableWhen?: FHIREnableWhen[];
  enableBehavior?: 'all' | 'any';
  required?: boolean;
  repeats?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  answerValueSet?: string;
  answerOption?: FHIRAnswerOption[];
  initial?: FHIRInitial[];
  item?: FHIRQuestionnaireItem[];
  maxOccurs?: number;
  _text?: {
    extension?: Array<{
      url: string;
      valueString?: string;
    }>;
  };
  showTooltip?: boolean;
  tooltipText?: string;
}

/**
 * Represents a FHIR QuestionnaireResponse resource
 */
export interface FHIRQuestionnaireResponse {
  resourceType: 'QuestionnaireResponse';
  id?: string;
  questionnaire: string;
  status:
    | 'in-progress'
    | 'completed'
    | 'amended'
    | 'entered-in-error'
    | 'stopped';
  subject?: FHIRReference;
  authored?: string;
  author?: FHIRReference;
  item?: FHIRQuestionnaireResponseItem[];
}

/**
 * Represents a FHIR QuestionnaireResponseItem
 */
export interface FHIRQuestionnaireResponseItem {
  linkId: string;
  text?: string;
  answer?: FHIRQuestionnaireResponseAnswer[];
  item?: FHIRQuestionnaireResponseItem[];
}

/**
 * Represents a FHIR QuestionnaireResponseAnswer
 */
export interface FHIRQuestionnaireResponseAnswer {
  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueUri?: string;
  valueAttachment?: any;
  valueCoding?: FHIRCoding;
  valueQuantity?: any;
  valueReference?: FHIRReference;
  item?: FHIRQuestionnaireResponseItem[];
}
