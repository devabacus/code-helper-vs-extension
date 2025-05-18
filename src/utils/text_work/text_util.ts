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

export function toPascalCase(str: string): string {
  return str.replace(/(^\w|-\w)/g, clearAndUpper);
}

export function toCamelCase(str: string): string {
  return str.replace(/-\w/g, clearAndUpper).replace(/^\w/, (c) => c.toLowerCase());
}

function clearAndUpper(text: string): string {
  return text.replace(/-/, "").toUpperCase();
}


export function toSnakeCase(str: string): string {
  if (!str) {return ''};
  return str
    // Сначала обрабатываем последовательности заглавных букв, за которыми идет строчная (например, SQLDatabase -> SQL_Database)
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    // Затем обрабатываем переходы от строчной/цифры к заглавной (например, myVar -> my_Var, var1Interface -> var1_Interface)
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    // И, наконец, все в нижний регистр
    .toLowerCase();
}


export const textGroupReplacer = (content: string, regex: RegExp, newTableName: string) => content.replace(regex, (match, p1) => {
    const trimmedCont = p1.trim();
    return `tables: [${trimmedCont ? trimmedCont + ', ' : ''}${newTableName}]`;
});