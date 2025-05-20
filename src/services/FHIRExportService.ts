import { v4 as uuidv4 } from 'uuid';
import { IFormElement, FormMetadata } from '../types/form';
import {
  FHIRQuestionnaire,
  FHIRQuestionnaireItem,
  FHIRAnswerOption,
} from '../types/fhir';
import { FHIRMappingService } from './FHIRMappingService';

/**
 * Service for exporting form structures to FHIR Questionnaire resources
 */
export class FHIRExportService {
  private mappingService: FHIRMappingService;

  constructor() {
    this.mappingService = new FHIRMappingService();
  }

  /**
   * Converts the form to a FHIR Questionnaire resource
   * @param elements The form elements
   * @param metadata The form metadata
   * @returns A FHIR Questionnaire resource
   */
  public toQuestionnaire(
    elements: IFormElement[],
    metadata: FormMetadata
  ): FHIRQuestionnaire {
    const questionnaire: FHIRQuestionnaire = {
      resourceType: 'Questionnaire',
      id: metadata.id || uuidv4(),
      url: metadata.url || `urn:uuid:${uuidv4()}`,
      title: metadata.title || 'Untitled Form',
      status: metadata.status || 'draft',
      date: metadata.date || new Date().toISOString().split('T')[0],
      publisher: metadata.publisher,
      description: metadata.description,
      version: metadata.version,
      item: this.mapElementsToItems(elements),
    };

    return questionnaire;
  }

  /**
   * Converts an array of form elements to FHIR QuestionnaireItems
   * @param elements The form elements
   * @returns An array of FHIR QuestionnaireItems
   */
  private mapElementsToItems(
    elements: IFormElement[]
  ): FHIRQuestionnaireItem[] {
    return elements
      .filter((element) => element.type !== 'image') // Skip pure image elements
      .map((element) => this.mapElementToItem(element));
  }

  /**
   * Converts a single form element to a FHIR QuestionnaireItem
   * @param element The form element
   * @returns A FHIR QuestionnaireItem
   */
  private mapElementToItem(element: IFormElement): FHIRQuestionnaireItem {
    // Start with the basic item properties
    const item: FHIRQuestionnaireItem = {
      linkId: element.linkId || element.id,
      text: element.label,
      type:
        element.fhirType ||
        this.mappingService.elementTypeToFHIRType(element.type),
      required: element.required || false,
    };

    // Add description if available
    if (element.description) {
      item._text = {
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/rendering-xhtml',
            valueString: element.description,
          },
        ],
      };
    }

    // Add validation constraints
    if (element.minLength !== undefined) item.minLength = element.minLength;
    if (element.maxLength !== undefined) item.maxLength = element.maxLength;

    // Add answer options for select, radio, checkbox
    if (
      element.options &&
      ['select', 'radio', 'checkbox'].includes(element.type)
    ) {
      item.answerOption = element.options.map((option) => {
        const answerOption: FHIRAnswerOption = {
          valueCoding: {
            system: 'http://example.org/answer-codes',
            code: option.value,
            display: option.label,
          },
        };
        return answerOption;
      });
    }

    // Add nested items for groups
    if (element.elements && element.type === 'group') {
      item.item = this.mapElementsToItems(element.elements);
    }

    // Add FHIR-specific properties if they exist
    if (element.code) item.code = element.code;
    if (element.prefix) item.prefix = element.prefix;
    if (element.readOnly) item.readOnly = element.readOnly;
    if (element.enableWhen) item.enableWhen = element.enableWhen;
    if (element.answerValueSet) item.answerValueSet = element.answerValueSet;
    if (element.repeats) item.repeats = element.repeats;
    if (element.maxOccurs) item.maxOccurs = element.maxOccurs;

    return item;
  }
}
