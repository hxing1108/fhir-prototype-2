import { FHIRMappingService } from './FHIRMappingService';
import { FormElementType } from '../types/form';

describe('FHIR Mapping Service', () => {
  const mappingService = new FHIRMappingService();

  test('maps editor element types to FHIR types correctly', () => {
    expect(mappingService.elementTypeToFHIRType('text')).toBe('string');
    expect(mappingService.elementTypeToFHIRType('textarea')).toBe('text');
    expect(mappingService.elementTypeToFHIRType('number')).toBe('decimal');
    expect(mappingService.elementTypeToFHIRType('select')).toBe('choice');
    expect(mappingService.elementTypeToFHIRType('group')).toBe('group');
    expect(mappingService.elementTypeToFHIRType('header')).toBe('display');
    expect(mappingService.elementTypeToFHIRType('image')).toBe('display');
    expect(mappingService.elementTypeToFHIRType('yesNo')).toBe('boolean');
    expect(mappingService.elementTypeToFHIRType('dateTime')).toBe('dateTime');
    expect(mappingService.elementTypeToFHIRType('attachment')).toBe(
      'attachment'
    );
  });

  test('maps FHIR types to editor element types correctly', () => {
    expect(mappingService.fhirTypeToElementType('string')).toBe('text');
    expect(mappingService.fhirTypeToElementType('text')).toBe('textarea');
    expect(mappingService.fhirTypeToElementType('group')).toBe('group');
    expect(mappingService.fhirTypeToElementType('choice')).toBe('select');
    expect(mappingService.fhirTypeToElementType('open-choice')).toBe('select');
    expect(mappingService.fhirTypeToElementType('decimal')).toBe('number');
    expect(mappingService.fhirTypeToElementType('integer')).toBe('number');
    expect(mappingService.fhirTypeToElementType('boolean')).toBe('yesNo');
    expect(mappingService.fhirTypeToElementType('display')).toBe('header');
    expect(mappingService.fhirTypeToElementType('dateTime')).toBe('dateTime');
  });

  test('handles unknown element types gracefully', () => {
    expect(
      mappingService.elementTypeToFHIRType('unknown' as FormElementType)
    ).toBe('string');
    expect(mappingService.fhirTypeToElementType('unknown')).toBe('text');
  });
});
