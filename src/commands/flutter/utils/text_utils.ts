import { getCurrentLineText } from "../../../utils/ui/ui_util";


export async function getConstructorData(): Promise<Record<string, any>> {

    const lineText = getCurrentLineText();
    const regexMatch = lineText!.match(/(\w+)\s?\((.+)\)/)!;
    const pageName = regexMatch[1].split('Page')[0];
    const dirtyParamList = regexMatch[2].split(',');
    const paramList: string[] = [];

    const exludeChars = ['.', 'required', 'this', 'key', 'super', '}', '{'];

    for (const dirtyParam of dirtyParamList) {
        let param = dirtyParam;
        for (const excl of exludeChars) {
            param = param.replace(excl, '');
        }
        if (param !== '') {
            paramList.push(param.trim());
        }
    }
    const constrData = { pageName, params: paramList };
    console.log(constrData);

    return constrData;
}