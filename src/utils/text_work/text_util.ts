export function textValidator(text: string): string | null {
    if (text.match(/^[a-z_][a-z0-9_]*$/)) {
        return null;
    } else {
        return 'Название должно содержать только маленькие буквы, цифры и _';
    }
}
