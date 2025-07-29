import { DictionaryPresets } from "../dictionary_presets";

export const serverpodDeployManifest = {
    // Словари по умолчанию для файлов с маркером `// manifest:deploy`
    dictionaries: DictionaryPresets.PROJECT_ONLY,
} as const;