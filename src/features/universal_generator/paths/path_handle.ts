// universal_generator/paths/path_handle.ts

import { GenerationConfig } from "./generation_config";

interface PathInfo {
    sourceBasePath: string;
    destinationBasePath: string;
    relativePath: string;
}

export function getPathInfo(config: GenerationConfig, filePath: string): PathInfo {
    if (filePath.startsWith('feature/')) {
        return {
            sourceBasePath: config.sourceFeaturePath,
            destinationBasePath: config.targetFeaturePath,
            relativePath: filePath.substring('feature/'.length) // Удаляем префикс
        };
    }

    if (filePath.startsWith('server/')) {
        return {
            sourceBasePath: config.templServerProjectPath,
            destinationBasePath: config.targetServerProjectPath,
            relativePath: filePath.substring('server/'.length)
        };
    }
    if (filePath.startsWith('flutter/')) {
        return {
            sourceBasePath: config.templFlutterProjectPath,
            destinationBasePath: config.targetFlutterProjectPath,
            relativePath: filePath.substring('flutter/'.length)
        };
    }
    if (filePath.startsWith('lib/')) {
        return {
            sourceBasePath: config.templFlutterProjectPath,
            destinationBasePath: config.targetFlutterProjectPath,
            relativePath: filePath
        };
    }
    
    // 3. Резервный вариант, если префикс не указан.
    return {
        sourceBasePath: config.sourceFeaturePath,
        destinationBasePath: config.targetFeaturePath,
        relativePath: filePath
    };
}