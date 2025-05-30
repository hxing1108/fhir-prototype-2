/**
 * FHIR-Basisdefinitionen für Questionnaire und QuestionnaireResponse
 */

// Gemeinsame Basistypen
export interface FHIRResource {
  resourceType: string;
  id?: string;
  meta?: FHIRMeta;
}

export interface FHIRMeta {
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
  security?: FHIRCoding[];
  tag?: FHIRCoding[];
}

export interface FHIRIdentifier {
  system?: string;
  value?: string;
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: FHIRCodeableConcept;
  period?: FHIRPeriod;
  assigner?: FHIRReference;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

export interface FHIRCoding {
  system: string;
  code: string;
  display?: string;
  version?: string;
  userSelected?: boolean;
}

export interface FHIRReference {
  reference?: string;
  type?: string;
  display?: string;
  identifier?: FHIRIdentifier;
}

export interface FHIRPeriod {
  start?: string;
  end?: string;
}

export interface FHIRUsageContext {
  code: FHIRCoding;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueQuantity?: FHIRQuantity;
  valueRange?: FHIRRange;
  valueReference?: FHIRReference;
}

export interface FHIRQuantity {
  value?: number;
  comparator?: string;
  unit?: string;
  system?: string;
  code?: string;
}

export interface FHIRRange {
  low?: FHIRQuantity;
  high?: FHIRQuantity;
}

// Questionnaire-spezifische Typen
export interface FHIRQuestionnaire extends FHIRResource {
  resourceType: 'Questionnaire';
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
  answerValueSet?: string;
  answerOption?: FHIRAnswerOption[];
  initial?: FHIRInitial[];
  item?: FHIRQuestionnaireItem[];
  _text?: {
    extension?: FHIRExtension[];
  };
}

export interface FHIRExtension {
  url: string;
  valueString?: string;
  valueInteger?: number;
  valueBoolean?: boolean;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueQuantity?: FHIRQuantity;
  valueReference?: FHIRReference;
  valueCodeableConcept?: FHIRCodeableConcept;
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
  answerQuantity?: FHIRQuantity;
  answerReference?: FHIRReference;
}

export interface FHIRAnswerOption {
  valueString?: string;
  valueInteger?: number;
  valueDate?: string;
  valueTime?: string;
  valueCoding?: FHIRCoding;
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
  valueUrl?: string;
  valueAttachment?: FHIRAttachment;
  valueCoding?: FHIRCoding;
  valueQuantity?: FHIRQuantity;
  valueReference?: FHIRReference;
}

export interface FHIRAttachment {
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
}

// QuestionnaireResponse-spezifische Typen
export interface FHIRQuestionnaireResponse extends FHIRResource {
  resourceType: 'QuestionnaireResponse';
  questionnaire?: string;
  status:
    | 'in-progress'
    | 'completed'
    | 'amended'
    | 'entered-in-error'
    | 'stopped';
  subject?: FHIRReference;
  encounter?: FHIRReference;
  authored?: string;
  author?: FHIRReference;
  source?: FHIRReference;
  item?: FHIRQuestionnaireResponseItem[];
}

export interface FHIRQuestionnaireResponseItem {
  linkId: string;
  definition?: string;
  text?: string;
  answer?: FHIRQuestionnaireResponseAnswer[];
  item?: FHIRQuestionnaireResponseItem[];
}

export interface FHIRQuestionnaireResponseAnswer {
  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueUri?: string;
  valueUrl?: string;
  valueAttachment?: FHIRAttachment;
  valueCoding?: FHIRCoding;
  valueQuantity?: FHIRQuantity;
  valueReference?: FHIRReference;
  item?: FHIRQuestionnaireResponseItem[];
}
