import { DictionaryPresets } from "../dictionary_presets";

export const startProjectManifest = {
  // Словари по умолчанию для файлов с маркером `// manifest:start_project`
  dictionaries: DictionaryPresets.PROJECT_ONLY,
  
  // Главные директории, которые сканируются при запуске любой генерации.
  // Это отправная точка для поиска всех файлов-шаблонов.
  scan_dirs: [
    'lib/',
    'server/',
    'flutter/', // Добавлено для полноты
    'data/', // Добавлено для полноты
    'domain/', // Добавлено для полноты
    'presentation/', // Добавлено для полноты
  ],

} as const;