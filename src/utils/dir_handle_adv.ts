import * as path from 'path';
import { IFileSystem } from '../core/interfaces/file_system';

/**
 * Простая функция сканирования с поддержкой .templateignore только в корне
 */
export async function scanWithIgnore(
    directory: string,
    fileSystem: IFileSystem
): Promise<string[]> {
    // 1. Читаем игнор-файл в корне сканируемой директории
    const ignoreFilePath = path.join(directory, '.templateignore');
    let ignoredDirs: string[] = [];
    
    if (await fileSystem.exists(ignoreFilePath)) {
        const ignoreContent = await fileSystem.readFile(ignoreFilePath);
        ignoredDirs = ignoreContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(line => line.replace(/\/$/, '')); // убираем слеш в конце
    }

    // 2. Получаем все файлы рекурсивно
    const allFiles = await fileSystem.readDirectoryRecursive(directory);

    // 3. Фильтруем файлы - исключаем те, что в игнорируемых папках
    const filteredFiles = allFiles.filter(filePath => {
        const relativePath = path.relative(directory, filePath);
        
        // Проверяем, начинается ли путь файла с одной из игнорируемых директорий
        return !ignoredDirs.some(ignoredDir => {
            const normalizedPath = relativePath.replace(/\\/g, '/');
            return normalizedPath.startsWith(ignoredDir + '/') || normalizedPath === ignoredDir;
        });
    });

    return filteredFiles;
}