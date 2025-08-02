import { Field } from "../../features/universal_generator/serverpod_yaml_parser/formatters/code_formatter.interface";

export interface _IDriftCodeFormatter {
  getFieldsClass(fields: Field[]): string;
  getFieldsRequired(fields: Field[]): string;
  getFieldsReqThis(fields: Field[]): string;
  getFieldsComma(fields: string[]): string;
  getParamsInstDrift(classNameLower: string, fields: string[]): string;
  getParamsInstModel(fields: string[]): string;
  getParamsWithOutId(row: string): string;
  getParamsWrapValue(fields: string[]): string;
  formatRequiredTypeFields(fields: { type: string, name: string }[]): string;
}