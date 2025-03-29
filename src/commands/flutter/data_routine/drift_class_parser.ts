import { unCap } from "../../../utils/text_work/text_util";


export interface Field {
    type: string,
    name: string
}


export class DriftClassParser {

    private driftClass: string;


    constructor(driftClass: string) {
        this.driftClass = driftClass;
    }
    get driftClassName(): string {
        return this.driftClass.match(/\s(\w+)Table/)![1];
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

    private get fieldRows(): string[] {
        return this.fields.map((item) => `${item.type} ${item.name}`);
    }

    private filedRowsModif(modifier: string, sep: string): string {
        const field_list = this.fieldRows.map((item) => `${modifier} ${item}${sep}`);
        return field_list.join('\n');
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

    get fiedsComma(): string {
        return this.fieldsNameList.join(',');
    }

    private fieldsParamList(instance: string): string[] {
        return this.fieldsNameList.map((item) => `${item}: ${instance}.${item}`);
    }

    get paramsInstDrift(): string {
        return this.fieldsParamList(unCap(this.driftClassName)).join(', ');
    }

    get paramsInstModel(): string {
        return this.fieldsParamList(unCap('model')).join(', ');
    }

    paramsWithOutId(row: string): string {
        return row.replace(/.*id,\s?/, '');
    }

    get paramWrapValue(): string {
        return this.fieldsNameList.map((item) => 
            `${item}: Value(${unCap(this.driftClassName)}.${item})`).join(', ');
    }

    private driftTypeConverter(dType: string): string {
        if (dType === 'Text') {
            return 'String';
        } else if (dType === 'Int') {
            return unCap(dType);
        }
        return dType;
    }

}

