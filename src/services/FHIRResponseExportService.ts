import { v4 as uuidv4 } from 'uuid';
import { IFormElement, FormMetadata } from '../types/form';
import {
  FHIRQuestionnaireResponse,
  FHIRQuestionnaireResponseItem,
  FHIRQuestionnaireResponseAnswer,
  FHIRCoding,
} from '../types/fhir';

/**
 * Service for exporting form data to FHIR QuestionnaireResponse resources
 */
export class FHIRResponseExportService {
  /**
   * Converts form data to a FHIR QuestionnaireResponse resource
   * @param formData The form data as key-value pairs
   * @param elements The form elements
   * @param metadata The form metadata
   * @returns A FHIR QuestionnaireResponse resource
   */
  public toQuestionnaireResponse(
    formData: Record<string, any>,
    elements: IFormElement[],
    metadata: FormMetadata
  ): FHIRQuestionnaireResponse {
    const response: FHIRQuestionnaireResponse = {
      resourceType: 'QuestionnaireResponse',
      id: uuidv4(),
      questionnaire: metadata.url || `urn:uuid:${metadata.id || uuidv4()}`,
      status: 'completed',
      authored: new Date().toISOString(),
      item: this.mapDataToResponseItems(formData, elements),
    };

    return response;
  }

  /**
   * Converts form data to FHIR QuestionnaireResponseItems
   * @param formData The form data
   * @param elements The form elements
   * @returns An array of FHIR QuestionnaireResponseItems
   */
  private mapDataToResponseItems(
    formData: Record<string, any>,
    elements: IFormElement[]
  ): FHIRQuestionnaireResponseItem[] {
    return elements
      .filter((element) => !['header', 'image'].includes(element.type))
      .map((element) => this.mapDataToResponseItem(formData, element));
  }

  /**
   * Converts data for a single element to a FHIR QuestionnaireResponseItem
   * @param formData The form data
   * @param element The form element
   * @returns A FHIR QuestionnaireResponseItem
   */
  private mapDataToResponseItem(
    formData: Record<string, any>,
    element: IFormElement
  ): FHIRQuestionnaireResponseItem {
    const responseItem: FHIRQuestionnaireResponseItem = {
      linkId: element.linkId || element.id,
      text: element.label,
    };

    // Handle group elements recursively
    if (element.type === 'group' && element.elements) {
      responseItem.item = this.mapDataToResponseItems(
        formData,
        element.elements
      );
      return responseItem;
    }

    // Process answer data if available
    const value = formData[element.id];
    if (value !== undefined && value !== null && value !== '') {
      const answers = this.createAnswers(value, element);
      if (answers && answers.length > 0) {
        responseItem.answer = answers;
      }
    }

    return responseItem;
  }

  /**
   * Creates FHIR-compliant answers based on the element type
   * @param value The answer value
   * @param element The form element
   * @returns An array of FHIR QuestionnaireResponseAnswers
   */
  private createAnswers(
    value: any,
    element: IFormElement
  ): FHIRQuestionnaireResponseAnswer[] {
    const answers: FHIRQuestionnaireResponseAnswer[] = [];

    switch (element.type) {
      case 'text':
      case 'textarea':
      case 'email':
        answers.push({ valueString: String(value) });
        break;

      case 'number':
        answers.push({ valueDecimal: parseFloat(value) });
        break;

      case 'date':
        answers.push({ valueDate: String(value) });
        break;

      case 'dateTime':
        answers.push({ valueDateTime: String(value) });
        break;

      case 'time':
        answers.push({ valueTime: String(value) });
        break;

      case 'select':
      case 'radio':
        answers.push({
          valueCoding: this.createCodingFromOption(value, element),
        });
        break;

      case 'checkbox':
        if (Array.isArray(value)) {
          // For multiple selections, create one answer per selected value
          value.forEach((val) => {
            answers.push({
              valueCoding: this.createCodingFromOption(val, element),
            });
          });
        } else {
          // Single boolean checkbox
          answers.push({ valueBoolean: Boolean(value) });
        }
        break;

      case 'yesNo':
        answers.push({ valueBoolean: value === 'true' || value === true });
        break;

      default:
        // Default to string for unknown types
        answers.push({ valueString: String(value) });
    }

    return answers;
  }

  /**
   * Creates a FHIR Coding from a selection option
   * @param value The selected value
   * @param element The form element
   * @returns A FHIR Coding
   */
  private createCodingFromOption(
    value: string,
    element: IFormElement
  ): FHIRCoding {
    const option = element.options?.find((opt) => opt.value === value);

    return {
      system: 'http://example.org/answer-codes',
      code: value,
      display: option?.label || value,
    };
  }
}
