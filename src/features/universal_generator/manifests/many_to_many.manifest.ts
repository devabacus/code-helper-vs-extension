import { DictionaryPresets } from "../dictionary_presets";

export const manyToManyManifest = {
  // Словари по умолчанию для файлов с маркером `// manifest:many_to_many`
  dictionaries: DictionaryPresets.M2M,
} as const;