import { unCap } from "../../../../../../../utils/text_work/text_util";


export interface Field {
    type: string,
    name: string
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


    constructor(driftClass: string) {
        this.driftClass = driftClass;
    }

    private get fieldRows(): string[] {
        return this.fields.map((item) => `${item.type} ${item.name}`);
    }

    private filedRowsModif(modifier: string, sep: string): string {
        const field_list = this.fieldRows.map((item) => `${modifier} ${item}${sep}`);
        return field_list.join('\n');
    }

    private fieldsParamList(instance: string): string[] {
        return this.fieldsNameList.map((item) => `${item}: ${instance}.${item}`);
    }

    private driftTypeConverter(dType: string): string {
        if (dType === 'Text') {
            return 'String';
        } else if (dType === 'Int') {
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
        return this.filedRowsModif('final', ';');
    }

    get fieldsRequired(): string {
        return this.filedRowsModif('required', ',');
    }

    get fieldsReqThis(): string {
        return this.fieldsNameList.map((item) => `required this.${item},`).join('\n');
    }

    get fieldsNameList(): string[] {
        return this.fields.map((field) => `${field.name}`);
    }

    private get fieldsSimpleList() : string[] {
        return this.fieldsNameList.map((field)=>`${field}: ${field}`);

    }
    // id : id, title : title .....
    get fieldsSimple() : string {
        return this.fieldsSimpleList.join(', ');
    }

    get fieldsSimpleWithoutId() : string {
        const newList = this.fieldsSimpleList;
        newList.shift();
        return newList.join(', ');
    }

    // id,title
    get fieldsComma(): string {
        return this.fieldsNameList.join(',');
    }

    get paramsInstDrift(): string {
        return this.fieldsParamList(this.driftClassNameLower).join(', ');
    }

    get paramsInstModel(): string {
        return this.fieldsParamList(unCap('model')).join(', ');
    }

    paramsWithOutId(row: string): string {
        return row.replace(/.*id,\s?/, '');
    }

    get paramsWrapValue(): string {
        return this.fieldsNameList.map((item) =>`${item}: Value(${item})`).join(', ');
            // `${item}: Value(${unCap(this.driftClassNameUpper)}.${item})`).join(', ');
    }



}

