import { DictionaryPresets } from "../dictionary_presets";

export const serverpodManifest = {
  // Словари по умолчанию для файлов с маркером `// manifest:serverpod`
  dictionaries: DictionaryPresets.PROJECT_ONLY,
} as const;