import { Field } from '../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser';

export interface IDriftCodeFormatter {
  getFieldsClass(fields: Field[]): string;
  getFieldsRequired(fields: Field[]): string;
  getFieldsReqThis(fields: Field[]): string;
  getFieldsComma(fields: string[]): string;
  getParamsInstDrift(classNameLower: string, fields: string[]): string;
  getParamsInstModel(fields: string[]): string;
  getParamsWithOutId(row: string): string;
  getParamsWrapValue(fields: string[]): string;
}