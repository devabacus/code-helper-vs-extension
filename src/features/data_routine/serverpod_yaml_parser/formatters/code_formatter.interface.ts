// src/features/data_routine/formatters/drift_code_formatter.interface.ts
import { ServerpodField } from "./types";

export interface Field {
    type: string,
    name: string,
    nullable: boolean;
}

export interface ICodeFormatter {
  // Форматирование полей класса (для Drift классов)
  formatClassFields(fields: Field[]): string;

  // Форматирование полей с required this.field (для Drift классов)
  formatRequiredFields(fields: Field[]): string;

  // Форматирование полей в стиле required type name (универсальный)
  formatRequiredTypeFields(fields: Field[] | ServerpodField[]): string;

  // Форматирование параметров конструктора
  formatConstructorParams(fields: Field[] | ServerpodField[], instanceName?: string): string;

  // Форматирование перечисления полей через запятую
  formatFieldsComma(fields: Field[] | ServerpodField[]): string;

  // Форматирование полей в Value wrapper (для Drift)
  formatValueWrappedFields(fields: Field[]): string;

  // Форматирование простых параметров в стиле field: field
  formatSimpleFields(fields: Field[] | ServerpodField[]): string;

  // Форматирование простых параметров без id
  formatSimpleFieldsWithoutId(fields: Field[] | ServerpodField[]): string;

  // Извлечение параметров без id
  getParamsWithOutId(row: string): string;

  // Параметры для тестов (только для Field)
  getFieldsValueForTest(fields: Field[]): string[];
  getFieldsExpectValueTest(fields: Field[]): string[];
  formatInsertCompanionParams(fields: Field[]): string;

  // Новые методы для работы с ServerpodModel
  generateDriftTableColumns(fields: ServerpodField[]): string;
  mapServerpodTypeToDriftColumn(serverpodType: string): string;
  shouldSkipServerpodField(field: ServerpodField): boolean;
}
