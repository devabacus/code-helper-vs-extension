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
    if (str.match(/[sxz]$/) || str.match(/[cs]h$/)) {
        return str + 'es';

    } else if (str.match(/.*y$/)) {
        return str.replace(/(.*)([^aeiou])y$/, '$1$2ies');
    }
    return str + 's';


}


export const textGroupReplacer = (content: string, regex: RegExp, newTableName: string) => content.replace(regex, (match, p1) => {
    const trimmedCont = p1.trim();
    return `tables: [${trimmedCont ? trimmedCont + ', ' : ''}${newTableName}]`;
});