export function textValidator(text: string): string | null {
    if (text.match(/^[a-z_][a-z0-9_]*$/)) {
        return null;
    } else {
        return 'Название должно содержать только маленькие буквы, цифры и _';
    }
}


export function cap(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function unCap(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function pluralConvert(str: string): string {
    // return str.replace(/(.*)y$/, '$1ies');
    return str.replace(/(.*)([^aeiou])y$/, '$1$2ies');
}


export const textGroupReplacer = (content: string, regex: RegExp, newTableName: string) => content.replace(regex, (match, p1) => {
    const trimmedCont = p1.trim();
    return `tables: [${trimmedCont ? trimmedCont + ', ' : ''}${newTableName}]`;
});