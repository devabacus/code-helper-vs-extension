// src/features/data_routine/feature/data/datasources/local/tables/drift_class_parser.ts

import { unCap } from "../../../../../../../utils/text_work/text_util";
import { DriftCodeFormatter } from "../../../../../formatters/drift_code_formatter";
import { IDriftCodeFormatter } from "../../../../../formatters/drift_code_formatter.interface";

export interface Field {
    type: string,
    name: string,
    isNullable: boolean; // <--- Добавлено новое поле
}

export interface FieldValue {
    name: string,
    value: string
}

export interface IDriftClassParser {
    readonly driftClassNameUpper: string;
    readonly driftClassNameLower: string;
    readonly fields: Field[];
    readonly fieldsClass: string;
    readonly fieldsRequired: string;
    readonly fieldsNameList: string[];
    readonly fieldsComma: string;
    readonly paramsInstDrift: string;
    readonly paramsInstModel: string;
    paramsWithOutId(row: string): string;
    readonly paramsWrapValue: string;
}

export class DriftClassParser implements IDriftClassParser {
    driftClass: string;
    formatter: IDriftCodeFormatter;

    constructor(driftClass: string, formatter?: IDriftCodeFormatter) {
        this.driftClass = driftClass;
        this.formatter = formatter || new DriftCodeFormatter();
    }

    private driftTypeConverter(dType: string): string {
        if (dType === 'Text') {
            return 'String';
        } else if (dType === 'Int' || dType === 'Bool') {
            return unCap(dType);
        }
        return dType;
    }

    get driftClassNameUpper(): string {
        return this.driftClass.match(/\s(\w+)Table/)![1];
    }

    get driftClassNameLower(): string {
        return unCap(this.driftClassNameUpper);
    }

    get fields(): Field[] {
        // Обновленный регэкс для захвата типа, имени поля и опционального "?" для nullable
        const fieldsRegex = /(\w+Column(?:\??))\s+get\s+(\w+)/g;
        const fields: Field[] = [];
        let fieldMatch;
        while ((fieldMatch = fieldsRegex.exec(this.driftClass)) !== null) {
            const driftTypeWithNull = fieldMatch[1]; // e.g., "TextColumn" or "TextColumn?"
            const fieldName = fieldMatch[2];

            const isNullable = driftTypeWithNull.endsWith('?');
            const driftType = isNullable ? driftTypeWithNull.slice(0, -1) : driftTypeWithNull; // Удаляем '?' если есть
            const convertedType = this.driftTypeConverter(driftType.replace('Column', '')); // Удаляем 'Column' перед конвертацией

            fields.push({
                type: convertedType,
                name: fieldName,
                isNullable: isNullable
            });
        }
        return fields;
    }

    get fieldsClass(): string {
        return this.formatter.formatClassFields(this.fields);
    }

    get fieldsRequired(): string {
        return this.formatter.formatRequiredFields(this.fields);
    }

    get fieldsReqThis(): string {
        return this.formatter.formatRequiredFields(this.fields);
    }

    get fieldsNameList(): string[] {
        return this.fields.map((field) => field.name);
    }

    get fieldsSimple(): string {
        return this.formatter.formatSimpleFields(this.fields);
    }

    get fieldsSimpleWithoutId(): string {
        return this.formatter.formatSimpleFieldsWithoutId(this.fields);
    }

    get fieldsComma(): string {
        return this.formatter.formatFieldsComma(this.fields);
    }

    get paramsInstDrift(): string {
        return this.formatter.formatConstructorParams(this.fields, this.driftClassNameLower);
    }

    get paramsInstModel(): string {
        return this.formatter.formatConstructorParams(this.fields, unCap('model'));
    }

    paramsWithOutId(row: string): string {
        return row.replace(/.*id,\s?/, '');
    }

    get paramsWrapValue(): string {
        return this.formatter.formatValueWrappedFields(this.fields);
    }

    get fieldsForTest() : string[] {
        return this.formatter.getFieldsValueForTest(this.fields);

    }

    get fieldsExpectedForTest() : string[] {
        return this.formatter.getFieldsExpectValueTest(this.fields);

    }
}