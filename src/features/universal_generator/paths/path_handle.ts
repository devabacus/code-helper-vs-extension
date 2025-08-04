// universal_generator/paths/path_handle.ts

import { GenerationConfig } from "./generation_config";

export interface PathInfo {
    sourceBasePath: string;
    destinationBasePath: string;
    // Удаляем relativePath, так как он будет вычисляться в GenerationService
}

export function getPathInfo(config: GenerationConfig, dirKey: string): PathInfo {
    // dirKey - это ключ из scan_dirs, например "flutter/" или "server/"

    switch (dirKey) {
        case 'flutter/':
            return {
                sourceBasePath: config.templFlutterProjectPath,
                destinationBasePath: config.targetFlutterProjectPath,
            };

        case 'server/':
            return {
                sourceBasePath: config.templServerProjectPath,
                destinationBasePath: config.targetServerProjectPath,
            };
        
        case 'feature/':
             return {
                sourceBasePath: config.sourceFeaturePath,
                destinationBasePath: config.targetFeaturePath,
            };

        default:
            // Обработка неожиданных значений, можно выбросить ошибку
            throw new Error(`[getPathInfo] Unknown directory key: ${dirKey}`);
    }
}