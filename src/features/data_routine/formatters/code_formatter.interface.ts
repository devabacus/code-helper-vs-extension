// src/features/data_routine/formatters/drift_code_formatter.interface.ts
import { Field } from "../feature/data/datasources/local/tables/drift_class_parser";
import { ServerpodField } from "../serverpod_yaml_parser/types";

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
