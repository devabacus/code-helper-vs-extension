import * as yaml from 'js-yaml';

interface ParsedField {
  name: string;
  type: string;
  isNullable: boolean;
}

interface ParsedYamlOutput {
  className: string;
  fields: ParsedField[];
}

export class ServerpodYamlParser {
  private yamlContent: string;

  constructor(yamlContent: string) {
    this.yamlContent = yamlContent;
  }

  public parse(): ParsedYamlOutput {
    
    const doc: any = yaml.load(this.yamlContent);

    const className = doc.class; 
    const rawFields = doc.fields; 

    const fields: ParsedField[] = [];
    for (const fieldName in rawFields) {
      const fieldTypeString = rawFields[fieldName] as string; 
      const isNullable = fieldTypeString.endsWith('?');
      const type = isNullable ? fieldTypeString.slice(0, -1) : fieldTypeString;
      fields.push({ name: fieldName, type: type, isNullable: isNullable });
    }

    return { className, fields };
  }
}