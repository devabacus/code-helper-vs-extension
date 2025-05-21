// src/features/data_routine/formatters/drift_code_formatter.interface.ts

import { Field } from "../feature/data/datasources/local/tables/drift_class_parser";

export interface IDriftCodeFormatter {
    // Форматирование полей класса
    formatClassFields(fields: { type: string, name: string }[]): string;
    
    // Форматирование полей с required this.field
    formatRequiredFields(fields: { type: string, name: string }[]): string;
    
    // Форматирование полей в стиле required type name
    formatRequiredTypeFields(fields: { type: string, name: string }[]): string;
    
    // Форматирование параметров конструктора
    formatConstructorParams(fields: { type: string, name: string }[], instanceName?: string): string;
    
    // Форматирование перечисления полей через запятую
    formatFieldsComma(fields: { type: string, name: string }[]): string;
    
    // Форматирование полей в Value wrapper (для Drift)
    formatValueWrappedFields(fields: { type: string, name: string }[]): string;
    
    // Форматирование простых параметров в стиле field: field
    formatSimpleFields(fields: { type: string, name: string }[]): string;
    
    // Форматирование простых параметров без id
    formatSimpleFieldsWithoutId(fields: { type: string, name: string }[]): string;
    
    // Извлечение параметров без id
    getParamsWithOutId(row: string): string;

    // Параметры для тестов
    // paramsForTest()
    getFieldsValueForTest(fields: Field[]): string[];

    getFieldsExpectValueTest(fields: Field[]): string[];
    
    formatInsertCompanionParams(fields: Field[]): string;
}
 