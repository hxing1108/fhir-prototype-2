import { FHIRQuestionnaire, FHIRQuestionnaireResponse } from '../types/fhir';

/**
 * Service for converting FHIR resources to XML format
 */
export class FHIRXMLExportService {
  /**
   * Converts a FHIR Questionnaire to XML format
   * @param questionnaire The FHIR Questionnaire resource
   * @returns XML string representation
   */
  public questionnaireToXML(questionnaire: FHIRQuestionnaire): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<Questionnaire xmlns="http://hl7.org/fhir">\n';
    
    if (questionnaire.id) {
      xml += `  <id value="${this.escapeXML(questionnaire.id)}" />\n`;
    }
    
    if (questionnaire.url) {
      xml += `  <url value="${this.escapeXML(questionnaire.url)}" />\n`;
    }
    
    if (questionnaire.version) {
      xml += `  <version value="${this.escapeXML(questionnaire.version)}" />\n`;
    }
    
    if (questionnaire.title) {
      xml += `  <title value="${this.escapeXML(questionnaire.title)}" />\n`;
    }
    
    xml += `  <status value="${questionnaire.status}" />\n`;
    
    if (questionnaire.date) {
      xml += `  <date value="${this.escapeXML(questionnaire.date)}" />\n`;
    }
    
    if (questionnaire.publisher) {
      xml += `  <publisher value="${this.escapeXML(questionnaire.publisher)}" />\n`;
    }
    
    if (questionnaire.description) {
      xml += `  <description value="${this.escapeXML(questionnaire.description)}" />\n`;
    }
    
    if (questionnaire.item && questionnaire.item.length > 0) {
      questionnaire.item.forEach(item => {
        xml += this.itemToXML(item, 2);
      });
    }
    
    xml += '</Questionnaire>';
    return xml;
  }

  /**
   * Converts a FHIR QuestionnaireResponse to XML format with questionnaire metadata
   * @param response The FHIR QuestionnaireResponse resource
   * @param questionnaire The FHIR Questionnaire resource (optional, for metadata)
   * @returns XML string representation
   */
  public questionnaireResponseToXML(response: FHIRQuestionnaireResponse, questionnaire?: FHIRQuestionnaire): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<QuestionnaireResponse xmlns="http://hl7.org/fhir">\n';
    
    if (response.id) {
      xml += `  <id value="${this.escapeXML(response.id)}" />\n`;
    }
    
    xml += `  <questionnaire value="${this.escapeXML(response.questionnaire)}" />\n`;
    xml += `  <status value="${response.status}" />\n`;
    
    if (response.authored) {
      xml += `  <authored value="${this.escapeXML(response.authored)}" />\n`;
    }
    
    if (response.item && response.item.length > 0) {
      response.item.forEach(item => {
        xml += this.responseItemToXML(item, 2, questionnaire?.item);
      });
    }
    
    xml += '</QuestionnaireResponse>';
    return xml;
  }

  /**
   * Creates a combined XML export with both questionnaire structure and responses
   * @param questionnaire The FHIR Questionnaire resource
   * @param response The FHIR QuestionnaireResponse resource
   * @returns Combined XML string representation
   */
  public combinedQuestionnaireResponseToXML(questionnaire: FHIRQuestionnaire, response: FHIRQuestionnaireResponse): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<Bundle xmlns="http://hl7.org/fhir">\n';
    xml += '  <resourceType value="Bundle" />\n';
    xml += '  <type value="collection" />\n';
    
    // Add Questionnaire as first entry
    xml += '  <entry>\n';
    xml += '    <resource>\n';
    xml += this.questionnaireToXML(questionnaire).split('\n').map(line => 
      line.startsWith('<?xml') ? '' : `      ${line}`
    ).filter(line => line.trim()).join('\n') + '\n';
    xml += '    </resource>\n';
    xml += '  </entry>\n';
    
    // Add QuestionnaireResponse as second entry with metadata
    xml += '  <entry>\n';
    xml += '    <resource>\n';
    xml += this.enhancedQuestionnaireResponseToXML(response, questionnaire).split('\n').map(line => 
      line.startsWith('<?xml') ? '' : `      ${line}`
    ).filter(line => line.trim()).join('\n') + '\n';
    xml += '    </resource>\n';
    xml += '  </entry>\n';
    
    xml += '</Bundle>';
    return xml;
  }

  /**
   * Creates an enhanced QuestionnaireResponse XML that includes questionnaire metadata
   * @param response The FHIR QuestionnaireResponse resource
   * @param questionnaire The FHIR Questionnaire resource for metadata
   * @returns Enhanced XML string representation
   */
  public enhancedQuestionnaireResponseToXML(response: FHIRQuestionnaireResponse, questionnaire: FHIRQuestionnaire): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<QuestionnaireResponse xmlns="http://hl7.org/fhir">\n';
    
    if (response.id) {
      xml += `  <id value="${this.escapeXML(response.id)}" />\n`;
    }
    
    xml += `  <questionnaire value="${this.escapeXML(response.questionnaire)}" />\n`;
    xml += `  <status value="${response.status}" />\n`;
    
    if (response.authored) {
      xml += `  <authored value="${this.escapeXML(response.authored)}" />\n`;
    }
    
    if (response.item && response.item.length > 0) {
      response.item.forEach(item => {
        xml += this.enhancedResponseItemToXML(item, 2, questionnaire.item);
      });
    }
    
    xml += '</QuestionnaireResponse>';
    return xml;
  }

  /**
   * Converts a questionnaire item to XML
   * @param item The questionnaire item
   * @param indentLevel The indentation level
   * @returns XML string for the item
   */
  private itemToXML(item: any, indentLevel: number): string {
    const indent = '  '.repeat(indentLevel);
    let xml = `${indent}<item>\n`;
    
    xml += `${indent}  <linkId value="${this.escapeXML(item.linkId)}" />\n`;
    
    if (item.text) {
      xml += `${indent}  <text value="${this.escapeXML(item.text)}" />\n`;
    }
    
    xml += `${indent}  <type value="${item.type}" />\n`;
    
    if (item.required) {
      xml += `${indent}  <required value="${item.required}" />\n`;
    }
    
    if (item.repeats) {
      xml += `${indent}  <repeats value="${item.repeats}" />\n`;
    }
    
    if (item.readOnly) {
      xml += `${indent}  <readOnly value="${item.readOnly}" />\n`;
    }
    
    if (item.maxLength) {
      xml += `${indent}  <maxLength value="${item.maxLength}" />\n`;
    }
    
    if (item.minLength) {
      xml += `${indent}  <minLength value="${item.minLength}" />\n`;
    }
    
    if (item.answerOption && item.answerOption.length > 0) {
      item.answerOption.forEach((option: any) => {
        xml += `${indent}  <answerOption>\n`;
        if (option.valueCoding) {
          xml += `${indent}    <valueCoding>\n`;
          if (option.valueCoding.system) {
            xml += `${indent}      <system value="${this.escapeXML(option.valueCoding.system)}" />\n`;
          }
          if (option.valueCoding.code) {
            xml += `${indent}      <code value="${this.escapeXML(option.valueCoding.code)}" />\n`;
          }
          if (option.valueCoding.display) {
            xml += `${indent}      <display value="${this.escapeXML(option.valueCoding.display)}" />\n`;
          }
          xml += `${indent}    </valueCoding>\n`;
        }
        xml += `${indent}  </answerOption>\n`;
      });
    }
    
    if (item.item && item.item.length > 0) {
      item.item.forEach((subItem: any) => {
        xml += this.itemToXML(subItem, indentLevel + 1);
      });
    }
    
    xml += `${indent}</item>\n`;
    return xml;
  }

  /**
   * Converts a questionnaire response item to XML
   * @param item The response item
   * @param indentLevel The indentation level
   * @param questionnaireItems The corresponding questionnaire items for metadata
   * @returns XML string for the response item
   */
  private responseItemToXML(item: any, indentLevel: number, questionnaireItems?: any[]): string {
    const indent = '  '.repeat(indentLevel);
    let xml = `${indent}<item>\n`;
    
    xml += `${indent}  <linkId value="${this.escapeXML(item.linkId)}" />\n`;
    
    if (item.text) {
      xml += `${indent}  <text value="${this.escapeXML(item.text)}" />\n`;
    }
    
    if (item.answer && item.answer.length > 0) {
      item.answer.forEach((answer: any) => {
        xml += `${indent}  <answer>\n`;
        
        if (answer.valueString !== undefined) {
          xml += `${indent}    <valueString value="${this.escapeXML(answer.valueString)}" />\n`;
        } else if (answer.valueBoolean !== undefined) {
          xml += `${indent}    <valueBoolean value="${answer.valueBoolean}" />\n`;
        } else if (answer.valueDecimal !== undefined) {
          xml += `${indent}    <valueDecimal value="${answer.valueDecimal}" />\n`;
        } else if (answer.valueInteger !== undefined) {
          xml += `${indent}    <valueInteger value="${answer.valueInteger}" />\n`;
        } else if (answer.valueDate !== undefined) {
          xml += `${indent}    <valueDate value="${this.escapeXML(answer.valueDate)}" />\n`;
        } else if (answer.valueDateTime !== undefined) {
          xml += `${indent}    <valueDateTime value="${this.escapeXML(answer.valueDateTime)}" />\n`;
        } else if (answer.valueTime !== undefined) {
          xml += `${indent}    <valueTime value="${this.escapeXML(answer.valueTime)}" />\n`;
        } else if (answer.valueCoding) {
          xml += `${indent}    <valueCoding>\n`;
          if (answer.valueCoding.system) {
            xml += `${indent}      <system value="${this.escapeXML(answer.valueCoding.system)}" />\n`;
          }
          if (answer.valueCoding.code) {
            xml += `${indent}      <code value="${this.escapeXML(answer.valueCoding.code)}" />\n`;
          }
          if (answer.valueCoding.display) {
            xml += `${indent}      <display value="${this.escapeXML(answer.valueCoding.display)}" />\n`;
          }
          xml += `${indent}    </valueCoding>\n`;
        }
        
        xml += `${indent}  </answer>\n`;
      });
    }
    
    if (item.item && item.item.length > 0) {
      item.item.forEach((subItem: any) => {
        xml += this.responseItemToXML(subItem, indentLevel + 1, questionnaireItems);
      });
    }
    
    xml += `${indent}</item>\n`;
    return xml;
  }

  /**
   * Converts a questionnaire response item to XML with enhanced metadata
   * @param item The response item
   * @param indentLevel The indentation level
   * @param questionnaireItems The corresponding questionnaire items for metadata
   * @returns XML string for the enhanced response item
   */
  private enhancedResponseItemToXML(item: any, indentLevel: number, questionnaireItems?: any[]): string {
    const indent = '  '.repeat(indentLevel);
    let xml = `${indent}<item>\n`;
    
    xml += `${indent}  <linkId value="${this.escapeXML(item.linkId)}" />\n`;
    
    if (item.text) {
      xml += `${indent}  <text value="${this.escapeXML(item.text)}" />\n`;
    }
    
    // Find corresponding questionnaire item for metadata
    const questionnaireItem = this.findQuestionnaireItem(item.linkId, questionnaireItems);
    
    if (questionnaireItem) {
      // Add metadata from questionnaire
      xml += `${indent}  <!-- Questionnaire Metadata -->\n`;
      xml += `${indent}  <!-- type: ${questionnaireItem.type} -->\n`;
      xml += `${indent}  <!-- required: ${questionnaireItem.required || false} -->\n`;
      
      if (questionnaireItem.repeats) {
        xml += `${indent}  <!-- repeats: ${questionnaireItem.repeats} -->\n`;
      }
      
      if (questionnaireItem.readOnly) {
        xml += `${indent}  <!-- readOnly: ${questionnaireItem.readOnly} -->\n`;
      }
      
      if (questionnaireItem.maxLength) {
        xml += `${indent}  <!-- maxLength: ${questionnaireItem.maxLength} -->\n`;
      }
      
      if (questionnaireItem.minLength) {
        xml += `${indent}  <!-- minLength: ${questionnaireItem.minLength} -->\n`;
      }
      
      // Add metadata as extensions for proper FHIR compliance
      if (questionnaireItem.type || questionnaireItem.required || questionnaireItem.repeats || questionnaireItem.readOnly) {
        xml += `${indent}  <extension url="http://example.org/questionnaire-metadata">\n`;
        xml += `${indent}    <extension url="type">\n`;
        xml += `${indent}      <valueString value="${questionnaireItem.type}" />\n`;
        xml += `${indent}    </extension>\n`;
        xml += `${indent}    <extension url="required">\n`;
        xml += `${indent}      <valueBoolean value="${questionnaireItem.required || false}" />\n`;
        xml += `${indent}    </extension>\n`;
        
        if (questionnaireItem.repeats) {
          xml += `${indent}    <extension url="repeats">\n`;
          xml += `${indent}      <valueBoolean value="${questionnaireItem.repeats}" />\n`;
          xml += `${indent}    </extension>\n`;
        }
        
        if (questionnaireItem.readOnly) {
          xml += `${indent}    <extension url="readOnly">\n`;
          xml += `${indent}      <valueBoolean value="${questionnaireItem.readOnly}" />\n`;
          xml += `${indent}    </extension>\n`;
        }
        
        if (questionnaireItem.maxLength) {
          xml += `${indent}    <extension url="maxLength">\n`;
          xml += `${indent}      <valueInteger value="${questionnaireItem.maxLength}" />\n`;
          xml += `${indent}    </extension>\n`;
        }
        
        xml += `${indent}  </extension>\n`;
      }
    }
    
    if (item.answer && item.answer.length > 0) {
      item.answer.forEach((answer: any) => {
        xml += `${indent}  <answer>\n`;
        
        if (answer.valueString !== undefined) {
          xml += `${indent}    <valueString value="${this.escapeXML(answer.valueString)}" />\n`;
        } else if (answer.valueBoolean !== undefined) {
          xml += `${indent}    <valueBoolean value="${answer.valueBoolean}" />\n`;
        } else if (answer.valueDecimal !== undefined) {
          xml += `${indent}    <valueDecimal value="${answer.valueDecimal}" />\n`;
        } else if (answer.valueInteger !== undefined) {
          xml += `${indent}    <valueInteger value="${answer.valueInteger}" />\n`;
        } else if (answer.valueDate !== undefined) {
          xml += `${indent}    <valueDate value="${this.escapeXML(answer.valueDate)}" />\n`;
        } else if (answer.valueDateTime !== undefined) {
          xml += `${indent}    <valueDateTime value="${this.escapeXML(answer.valueDateTime)}" />\n`;
        } else if (answer.valueTime !== undefined) {
          xml += `${indent}    <valueTime value="${this.escapeXML(answer.valueTime)}" />\n`;
        } else if (answer.valueCoding) {
          xml += `${indent}    <valueCoding>\n`;
          if (answer.valueCoding.system) {
            xml += `${indent}      <system value="${this.escapeXML(answer.valueCoding.system)}" />\n`;
          }
          if (answer.valueCoding.code) {
            xml += `${indent}      <code value="${this.escapeXML(answer.valueCoding.code)}" />\n`;
          }
          if (answer.valueCoding.display) {
            xml += `${indent}      <display value="${this.escapeXML(answer.valueCoding.display)}" />\n`;
          }
          xml += `${indent}    </valueCoding>\n`;
        }
        
        xml += `${indent}  </answer>\n`;
      });
    }
    
    if (item.item && item.item.length > 0) {
      item.item.forEach((subItem: any) => {
        xml += this.enhancedResponseItemToXML(subItem, indentLevel + 1, questionnaireItems);
      });
    }
    
    xml += `${indent}</item>\n`;
    return xml;
  }

  /**
   * Finds a questionnaire item by linkId
   * @param linkId The linkId to search for
   * @param items The questionnaire items to search in
   * @returns The matching questionnaire item or null
   */
  private findQuestionnaireItem(linkId: string, items?: any[]): any | null {
    if (!items) return null;
    
    for (const item of items) {
      if (item.linkId === linkId) {
        return item;
      }
      
      if (item.item) {
        const found = this.findQuestionnaireItem(linkId, item.item);
        if (found) return found;
      }
    }
    
    return null;
  }

  /**
   * Escapes XML special characters
   * @param text The text to escape
   * @returns Escaped text
   */
  private escapeXML(text: string): string {
    if (!text) return '';
    return text.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
} 