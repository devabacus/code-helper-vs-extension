import * as fs from 'fs';
import * as path from 'path';

// Базовый метод вставки текста после найденного текста в указанный файл
export const insertTextAfter = async (filePath: string, searchText: string, insertText: string): Promise<boolean> => {
    try {
        // Проверяем существование файла
        if (!fs.existsSync(filePath)) {
            console.error(`Файл не найден: ${filePath}`);
            return false;
        }

        // Читаем содержимое файла
        let content = fs.readFileSync(filePath, 'utf8');

        // Ищем указанный текст
        const index = content.indexOf(searchText);
        if (index === -1) {
            console.warn(`Текст "${searchText}" не найден в файле ${path.basename(filePath)}`);
            return false;
        }

        // Формируем новое содержимое файла
        const newContent =
            content.substring(0, index + searchText.length) +
            '\n' +
            insertText +
            content.substring(index + searchText.length);

        // Записываем изменения обратно в файл
        fs.writeFileSync(filePath, newContent, 'utf8');

        return true;
    } catch (error) {
        console.error(`Ошибка при вставке текста: ${error}`);
        return false;
    }
};

// Вставка текста с использованием регулярных выражений для более сложного поиска
export const insertTextWithRegex = async (filePath: string, regex: RegExp, insertText: string): Promise<boolean> => {
    try {
        // Проверяем существование файла
        if (!fs.existsSync(filePath)) {
            console.error(`Файл не найден: ${filePath}`);
            return false;
        }

        // Читаем содержимое файла
        let content = fs.readFileSync(filePath, 'utf8');

        // Ищем совпадение с регулярным выражением
        const match = regex.exec(content);
        if (!match) {
            console.warn(`Совпадение с регулярным выражением не найдено в файле ${path.basename(filePath)}`);
            return false;
        }

        // Формируем новое содержимое файла
        const newContent =
            content.substring(0, match.index + match[0].length) +
            insertText +
            content.substring(match.index + match[0].length);

        // Записываем изменения обратно в файл
        fs.writeFileSync(filePath, newContent, 'utf8');

        return true;
    } catch (error) {
        console.error(`Ошибка при вставке текста с регулярным выражением: ${error}`);
        return false;
    }
};

// Вставка текста в начало файла
export const insAtFlStart = async (filePath: string, insertText: string): Promise<boolean> => {
    try {
        // Проверяем существование файла
        if (!fs.existsSync(filePath)) {
            console.error(`Файл не найден: ${filePath}`);
            return false;
        }

        // Читаем содержимое файла
        let content = fs.readFileSync(filePath, 'utf8');

        // Добавляем текст в начало
        const newContent = insertText + content;

        // Записываем изменения обратно в файл
        fs.writeFileSync(filePath, newContent, 'utf8');

        return true;
    } catch (error) {
        console.error(`Ошибка при вставке текста в начало файла: ${error}`);
        return false;
    }
};

// Вставка текста в конец файла
export const insertAtFileEnd = async (filePath: string, insertText: string): Promise<boolean> => {
    try {
        // Проверяем существование файла
        if (!fs.existsSync(filePath)) {
            console.error(`Файл не найден: ${filePath}`);
            return false;
        }

        // Читаем содержимое файла
        let content = fs.readFileSync(filePath, 'utf8');

        // Добавляем текст в конец
        const newContent = content + insertText;

        // Записываем изменения обратно в файл
        fs.writeFileSync(filePath, newContent, 'utf8');

        return true;
    } catch (error) {
        console.error(`Ошибка при вставке текста в конец файла: ${error}`);
        return false;
    }
};