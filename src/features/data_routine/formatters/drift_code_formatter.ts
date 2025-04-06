// src/features/data_routine/formatters/drift_code_formatter.ts

import { IDriftCodeFormatter } from './drift_code_formatter.interface';

export class DriftCodeFormatter implements IDriftCodeFormatter {
  formatClassFields(fields: { type: string, name: string }[]): string {
    const fieldRows = fields.map(field => `final ${field.type} ${field.name};`);
    return fieldRows.join('\n');
  }

  formatRequiredFields(fields: { type: string, name: string }[]): string {
    const fieldRows = fields.map(field => `required this.${field.name},`);
    return fieldRows.join('\n');
  }

  formatRequiredTypeFields(fields: { type: string, name: string }[]): string {
    const fieldRows = fields.map(field => `required ${field.type} ${field.name},`);
    return fieldRows.join('\n');
  }

  formatConstructorParams(fields: { type: string, name: string }[], instanceName: string = ''): string {
    if (instanceName) {
      return fields.map(field => `${field.name}: ${instanceName}.${field.name}`).join(', ');
    }
    return fields.map(field => `${field.name}: ${field.name}`).join(', ');
  }

  formatFieldsComma(fields: { type: string, name: string }[]): string {
    return fields.map(field => field.name).join(',');
  }

  formatValueWrappedFields(fields: { type: string, name: string }[]): string {
    return fields.map(field => `${field.name}: Value(${field.name})`).join(', ');
  }

  formatSimpleFields(fields: { type: string, name: string }[]): string {
    return fields.map(field => `${field.name}: ${field.name}`).join(', ');
  }

  formatSimpleFieldsWithoutId(fields: { type: string, name: string }[]): string {
    const withoutId = fields.filter(field => field.name !== 'id');
    return this.formatSimpleFields(withoutId);
  }

  getParamsWithOutId(row: string): string {
    return row.replace(/.*id,\s?/, '');
  }
}