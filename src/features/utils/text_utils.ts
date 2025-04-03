import { cap } from "../../utils/text_work/text_util";
import { getCurrentLineText } from "../../utils/ui/ui_util";


export function getConstrData(): Record<string, any> {

    const lineText = getCurrentLineText();
    const regexMatch = lineText!.match(/(\w+)\s?\((.+)\)/)!;
    const pageName = regexMatch[1].split('Page')[0].toLowerCase();

    const dirtyParamList = regexMatch[2].split(',');
    const paramList: string[] = [];

    const exludeChars = ['.', 'required', 'this', 'key', 'super', '}', '{'];

    for (const dirtyParam of dirtyParamList) {
        let param = dirtyParam;
        for (const excl of exludeChars) {
            param = param.replace(excl, '').trim();
        }
        if (param !== '') {
            paramList.push(param.trim());
        }
    }
    const constrData = { pageName, params: paramList };

    console.log(`page: ${constrData.pageName} params: ${constrData.params}`);

    return constrData;
}
// get widget class page data: class name, fields structure
export function getWdgClPgData() {

}

export interface ClsParams {
    name: string;
    type: string;
    isNullable: boolean;
    isRequired: boolean;
}

export function getPgName(clsDeclaration: string): string {
    const fieldRegex = /class\s(\w+)\s/;
    const clsName = clsDeclaration.match(fieldRegex)![1];
    const pgName = clsName.split('Page')[0].toLowerCase();
    return pgName;

}



export function parseClsParams(clsDeclaration: string): ClsParams[] {
    const dirty = clsDeclaration.match(/class[\s\S]*?(?=@)/g)![0];

    const _dirtyFields = getFields(dirty);
    return parseParams(_dirtyFields, dirty);
}



function getFields(clsDefin: string): string[] {
    const fieldRegex = /final.*/g;
    const dirtyFields: string[] = [];

    let match;

    while ((match = fieldRegex.exec(clsDefin)) !== null) {
        const dField = match[0];
        dirtyFields.push(dField);
    }
    return dirtyFields;
}


function parseParams(dirtyFields: string[], clsDeclaration: string): ClsParams[] {
    const fields: ClsParams[] = [];

    for (const item of dirtyFields) {
        const regRes = item.match(/(\w+\??)\W+(\w*);/)!;
        const name = regRes[2];
        const type = regRes[1];
        let isNullable = false;

        if (type.includes('?')) {
            isNullable = true;
        }
        const isRequired = getConstrParams(name, clsDeclaration);

        fields.push({ name: name, type: type, isNullable: isNullable, isRequired: isRequired });
    }
    return fields;
}

function getConstrParams(fieldName: string, clsDefin: string): boolean {
    const fieldRegex = /\(.*\)/;
    const regRes = clsDefin.match(fieldRegex)![0];
    const constrPrms = regRes.split(',');
    let isRequired = false;
    for (const prm of constrPrms) {
        if (prm.includes(fieldName) && prm.includes('required')) {
            isRequired = true;
        }
    }
    return isRequired;
}