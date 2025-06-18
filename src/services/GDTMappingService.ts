// GDT Code to Variable Name Mapping Service
export interface GDTMapping {
  code: string;
  bezeichnung: string;
  length: string;
  type: string;
  rule?: string;
  example?: string;
}

// GDT Code mappings based on the provided table
export const GDT_MAPPINGS: Record<string, GDTMapping> = {
  '0102': {
    code: '0102',
    bezeichnung: 'Softwareverantwortlicher (SV)',
    length: 'var',
    type: 'a',
    example: 'z.B. Firma'
  },
  '0103': {
    code: '0103',
    bezeichnung: 'Software',
    length: 'var',
    type: 'a',
    example: 'Name der Software'
  },
  '0132': {
    code: '0132',
    bezeichnung: 'Release-Stand der Software',
    length: 'var',
    type: 'a',
    example: '12.4'
  },
  '0201': {
    code: '0201',
    bezeichnung: '(N)-BSNR',
    length: '9',
    type: 'n',
    example: '947812345'
  },
  '0202': {
    code: '0202',
    bezeichnung: 'Name des Kostenträgers',
    length: 'var',
    type: 'a',
    example: 'Deutsche Rentenversicherung'
  },
  '0212': {
    code: '0212',
    bezeichnung: 'LANR',
    length: '9',
    type: 'n',
    example: '123456789'
  },
  '0950': {
    code: '0950',
    bezeichnung: 'Pharmazentralnummer Dauermedikament',
    length: 'var',
    type: 'a',
    example: '4877800'
  },
  '0957': {
    code: '0957',
    bezeichnung: 'Darreichungsform Dauermedikament',
    length: 'var',
    type: 'a',
    example: 'Filmtablette'
  },
  '3000': {
    code: '3000',
    bezeichnung: 'Patientennummer / Patientenkennung',
    length: 'var',
    type: 'a',
    example: '123456'
  },
  '3100': {
    code: '3100',
    bezeichnung: 'Namenszusatz / Vorsatzwort des Patienten',
    length: 'var',
    type: 'a',
    example: 'Von'
  },
  '3101': {
    code: '3101',
    bezeichnung: 'Name des Patienten',
    length: 'var',
    type: 'a',
    example: 'Schmitz'
  },
  '3102': {
    code: '3102',
    bezeichnung: 'Vorname des Patienten',
    length: 'var',
    type: 'a',
    example: 'Erna'
  },
  '3103': {
    code: '3103',
    bezeichnung: 'Geburtsdatum des Patienten',
    length: '8',
    type: 'd',
    rule: '021 304 313',
    example: '19661024'
  },
  '3104': {
    code: '3104',
    bezeichnung: 'Titel des Patienten',
    length: 'var',
    type: 'a',
    example: 'Dr.'
  },
  '3105': {
    code: '3105',
    bezeichnung: 'Versichertennummer des Patienten',
    length: 'var',
    type: 'a',
    rule: '053 776',
    example: '123456M789'
  },
  '3106': {
    code: '3106',
    bezeichnung: 'Wohnort des Patienten',
    length: 'var',
    type: 'a',
    example: '50859 Köln'
  },
  '3107': {
    code: '3107',
    bezeichnung: 'Straße des Patienten',
    length: 'var',
    type: 'a',
    example: 'Holzweg 106'
  },
  '3108': {
    code: '3108',
    bezeichnung: 'Versichertenart MFR',
    length: '1',
    type: 'n',
    rule: '116',
    example: '3'
  },
  '3110': {
    code: '3110',
    bezeichnung: 'Geschlecht des Patienten',
    length: '1',
    type: 'n',
    rule: '533',
    example: '1'
  },
  '3112': {
    code: '3112',
    bezeichnung: 'PLZ des Patienten',
    length: 'var',
    type: 'a',
    rule: '478 479',
    example: '50859'
  },
  '3113': {
    code: '3113',
    bezeichnung: 'Wohnort des Patienten',
    length: 'var',
    type: 'a',
    example: 'Köln'
  },
  '3114': {
    code: '3114',
    bezeichnung: 'Wohnsitzländercode',
    length: 'var',
    type: 'a',
    rule: '784',
    example: 'DE'
  },
  '3116': {
    code: '3116',
    bezeichnung: 'KV-Bereich',
    length: '2',
    type: 'n',
    rule: '722 531 774',
    example: '17'
  },
  '3119': {
    code: '3119',
    bezeichnung: 'Versichertennummer eGK des Patienten',
    length: '10',
    type: 'a',
    rule: '054 776',
    example: 'A123456780'
  },
  '3618': {
    code: '3618',
    bezeichnung: 'Mobiltelefonnummer des Patienten',
    length: 'var',
    type: 'a',
    example: '0172 9335 172'
  },
  '3619': {
    code: '3619',
    bezeichnung: 'Email-Adresse des Patienten',
    length: 'var',
    type: 'a',
    example: 'r.mustermann@dummy.de'
  },
  '3622': {
    code: '3622',
    bezeichnung: 'Größe des Patienten in cm',
    length: 'var',
    type: 'f',
    example: '175.50'
  },
  '3623': {
    code: '3623',
    bezeichnung: 'Gewicht des Patienten in kg',
    length: 'var',
    type: 'f',
    example: '90.50'
  },
  '3626': {
    code: '3626',
    bezeichnung: 'Telefonnummer des Patienten',
    length: 'var',
    type: 'a',
    example: '0951 3458 200'
  },
  '3628': {
    code: '3628',
    bezeichnung: 'Muttersprache des Patienten',
    length: 'var',
    type: 'a',
    example: 'Deutsch'
  },
  '3649': {
    code: '3649',
    bezeichnung: 'Dauerdiagnose ab Datum',
    length: '8',
    type: 'd',
    example: '01012012'
  },
  '3650': {
    code: '3650',
    bezeichnung: 'Dauerdiagnose',
    length: 'var',
    type: 'a',
    example: 'Diabetes mellitus'
  },
  '3651': {
    code: '3651',
    bezeichnung: 'Dauermedikament ab Datum',
    length: '8',
    type: 'd',
    example: '20111112'
  },
  '3652': {
    code: '3652',
    bezeichnung: 'Dauermedikament',
    length: 'var',
    type: 'a',
    example: 'Adalat'
  },
  '3654': {
    code: '3654',
    bezeichnung: 'Risikofaktoren',
    length: 'var',
    type: 'a',
    example: 'Raucher'
  },
  '3656': {
    code: '3656',
    bezeichnung: 'Allergien',
    length: 'var',
    type: 'a',
    example: 'Neurodermitis'
  },
  '3658': {
    code: '3658',
    bezeichnung: 'Unfälle',
    length: 'var',
    type: 'a',
    example: 'Motoradunfall'
  },
  '3660': {
    code: '3660',
    bezeichnung: 'Operationen',
    length: 'var',
    type: 'a',
    example: 'Blinddarm'
  },
  '3662': {
    code: '3662',
    bezeichnung: 'Anamnese',
    length: 'var',
    type: 'a',
    example: 'Frühgeburt'
  },
  '3664': {
    code: '3664',
    bezeichnung: 'Anzahl Geburten',
    length: 'var',
    type: 'n',
    example: '2'
  },
  '3666': {
    code: '3666',
    bezeichnung: 'Anzahl Kinder',
    length: 'var',
    type: 'n',
    example: '3'
  },
  '3668': {
    code: '3668',
    bezeichnung: 'Anzahl Schwangerschaften',
    length: 'var',
    type: 'n',
    example: '4'
  },
  '3670': {
    code: '3670',
    bezeichnung: 'Dauertherapie',
    length: 'var',
    type: 'a',
    example: 'Schmerzpumpe'
  },
  '3672': {
    code: '3672',
    bezeichnung: 'Kontrolltermine',
    length: '8',
    type: 'd',
    example: '19931201'
  },
  '3673': {
    code: '3673',
    bezeichnung: 'Dauerdiagnose ICD-Code',
    length: '3,5,6',
    type: 'a',
    rule: '022 486 489 490 491 492 728 729 735 761 817',
    example: 'E10.21'
  },
  '3674': {
    code: '3674',
    bezeichnung: 'Diagnosesicherheit Dauerdiagnose',
    length: '1',
    type: 'a',
    rule: '109',
    example: 'Z'
  },
  '3675': {
    code: '3675',
    bezeichnung: 'Seitenlokalisation Dauerdiagnose',
    length: '1',
    type: 'a',
    rule: '110',
    example: 'R'
  },
  '3676': {
    code: '3676',
    bezeichnung: 'Diagnoseerläuterung Dauerdiagnose',
    length: 'var',
    type: 'a',
    example: 'EKG eindeutig'
  },
  '3677': {
    code: '3677',
    bezeichnung: 'Diagnoseausnahmetatbestand Dauerdiagnose',
    length: 'var',
    type: 'a',
    rule: '491',
    example: 'true'
  },
  '3700': {
    code: '3700',
    bezeichnung: 'Bezeichnung der basisdiagnostischen Kategorie',
    length: 'var',
    type: 'a',
    example: 'Kardiovaskuläre Familienbelastung'
  },
  '3701': {
    code: '3701',
    bezeichnung: 'Inhalt der basisdiagnostischen Kategorie',
    length: 'var',
    type: 'a',
    example: 'Ja'
  }
  // Additional codes can be added here following the same pattern
};

/**
 * Service class for handling GDT code mappings
 */
export class GDTMappingService {
  /**
   * Convert a GDT code to a variable name
   * @param gdtCode - The GDT code to convert
   * @returns The variable name format or null if not found
   */
  static gdtCodeToVariable(gdtCode: string): string | null {
    const mapping = GDT_MAPPINGS[gdtCode];
    if (!mapping) {
      return null;
    }
    
    // Format: #GDT_[CODE]_[BEZEICHNUNG]#
    const variableName = mapping.bezeichnung
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    return `#GDT_${gdtCode}_${variableName}#`;
  }

  /**
   * Get GDT mapping by code
   * @param gdtCode - The GDT code to look up
   * @returns The GDT mapping or null if not found
   */
  static getMapping(gdtCode: string): GDTMapping | null {
    return GDT_MAPPINGS[gdtCode] || null;
  }

  /**
   * Check if a GDT code exists
   * @param gdtCode - The GDT code to check
   * @returns True if the code exists
   */
  static isValidGDTCode(gdtCode: string): boolean {
    return gdtCode in GDT_MAPPINGS;
  }

  /**
   * Get all available GDT codes
   * @returns Array of all GDT codes
   */
  static getAllCodes(): string[] {
    return Object.keys(GDT_MAPPINGS);
  }

  /**
   * Search GDT mappings by bezeichnung
   * @param searchTerm - The search term
   * @returns Array of matching GDT mappings
   */
  static searchByBezeichnung(searchTerm: string): GDTMapping[] {
    const term = searchTerm.toLowerCase();
    return Object.values(GDT_MAPPINGS).filter(mapping =>
      mapping.bezeichnung.toLowerCase().includes(term)
    );
  }
} 