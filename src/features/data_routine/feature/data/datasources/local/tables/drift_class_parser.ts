// src/features/data_routine/feature/data/datasources/local/tables/drift_class_parser.ts

import { unCap } from "../../../../../../../utils/text_work/text_util";
import { DriftCodeFormatter } from "../../../../../formatters/drift_code_formatter";
import { IDriftCodeFormatter } from "../../../../../formatters/drift_code_formatter.interface";

export interface Field {
    type: string,
    name: string
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
    private driftClass: string;
    private formatter: IDriftCodeFormatter;

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
        const fieldsRegex = /(\w+)Column get (\w+)/g;
        const fields: Field[] = [];
        let fieldMatch;
        while ((fieldMatch = fieldsRegex.exec(this.driftClass)) !== null) {
            const fieldType = this.driftTypeConverter(fieldMatch[1]);

            fields.push({
                type: fieldType, // тип колонки (Int, Text и т.д.)
                name: fieldMatch[2]  // имя колонки (id, title и т.д.)
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