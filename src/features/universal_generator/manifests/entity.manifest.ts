import { DictionaryPresets } from "../dictionary_presets";

export const entityManifest = {
    // Словари по умолчанию для файлов с маркером `// manifest:entity`
    dictionaries: DictionaryPresets.ENTITY,
} as const;