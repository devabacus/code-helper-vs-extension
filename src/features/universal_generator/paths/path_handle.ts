import { GenerationConfig } from "./generation_config";

interface PathInfo {
    sourceBasePath: string;
    destinationBasePath: string;
    relativePath: string;
}

export function getPathInfo(config: GenerationConfig, filePath: string): PathInfo {
    // 1. Проверяем, является ли файл серверным
    if (filePath.startsWith('server/')) {
        return {
            sourceBasePath: config.templServerProjectPath,
            destinationBasePath: config.targetServerProjectPath,
            relativePath: filePath.substring('server/'.length) // Удаляем префикс
        };
    }
    // 2. Проверяем, является ли файл файлом уровня Flutter-проекта
    if (filePath.startsWith('lib/')) {
        return {
            sourceBasePath: config.templFlutterProjectPath,
            destinationBasePath: config.targetFlutterProjectPath,
            relativePath: filePath
        };
    }
    // 3. В противном случае, это файл уровня фичи
    return {
        sourceBasePath: config.sourceFeaturePath,
        destinationBasePath: config.targetFeaturePath,
        relativePath: filePath
    };
}