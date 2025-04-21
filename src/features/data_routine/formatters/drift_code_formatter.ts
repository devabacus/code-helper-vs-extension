// src/features/data_routine/formatters/drift_code_formatter.ts

import { TcpSocketConnectOpts } from 'net';
import { IDriftCodeFormatter } from './drift_code_formatter.interface';
import { Field, FieldValue } from '../feature/data/datasources/local/tables/drift_class_parser';
import { prepareFieldsForTest } from './drift_prepare_fields_for_test';

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


  getFieldsValueForTest(fields: Field[]): string[] {
    const fieldsList: FieldValue[] = prepareFieldsForTest(fields);
    const firstRow = fieldsList.map((item) => `${item.name}: ${item.value}`).join(', ');
    const secondRow = firstRow.replaceAll('1', '2').replace('false', 'true');
    let wrapped = secondRow.replaceAll(/(\w+):\s*(.*?)(?:,|$)/g, '$1: Value($2),');
    wrapped = `id: Value(1), ` + wrapped.slice(0, -1);

    return [firstRow, secondRow, wrapped];
  }

  getFieldsExpectValueTest(fields: Field[]): string[] {
    const fieldsList: FieldValue[] = prepareFieldsForTest(fields);
    const firstRow = `.${fieldsList[0].name}, ${fieldsList[0].value}`;
    const secondRow = firstRow.replace('1', '2');
    return [firstRow, secondRow];
  }
}