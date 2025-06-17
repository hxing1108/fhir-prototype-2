import { FormElementType } from '../types/form';

/**
 * Service for mapping between editor's internal form element types and FHIR types
 */
export class FHIRMappingService {
  /**
   * Converts a form element type to the corresponding FHIR type
   * @param elementType The form element type
   * @returns The FHIR type
   */
  public elementTypeToFHIRType(elementType: FormElementType): string {
    const typeMap: Record<FormElementType, string> = {
      text: 'string',
      textarea: 'text',
      number: 'decimal',
      email: 'string',
      select: 'choice',
      checkbox: 'choice',
      radio: 'choice',
      date: 'date',
      group: 'group',
      header: 'display',
      image: 'display',
      yesNo: 'boolean',
      dateTime: 'dateTime',
      time: 'time',
      attachment: 'attachment',
      reference: 'reference',
      quantity: 'quantity',
    };

    return typeMap[elementType] || 'string';
  }

  /**
   * Converts a FHIR type to the corresponding form element type
   * @param fhirType The FHIR type
   * @returns The form element type
   */
  public fhirTypeToElementType(fhirType: string): FormElementType {
    const typeMap: Record<string, FormElementType> = {
      string: 'text',
      text: 'textarea',
      decimal: 'number',
      integer: 'number',
      boolean: 'yesNo',
      date: 'date',
      dateTime: 'dateTime',
      time: 'time',
      choice: 'select',
      'open-choice': 'select',
      group: 'group',
      display: 'header',
      attachment: 'attachment',
      reference: 'reference',
      quantity: 'quantity',
    };

    return typeMap[fhirType] || 'text';
  }
}
