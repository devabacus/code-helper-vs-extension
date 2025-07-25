import { Dictionaries } from "../replacement_util";

export const databaseManifest = {
  static: [
    'lib/core/data/datasources/local/interfaces/i_database_service.dart',
    'lib/core/data/datasources/local/services/database_service.dart',
    'lib/core/data/datasources/local/providers/database_provider.dart',
    'lib/core/data/datasources/local/database_types.dart',
    'lib/core/sync/base_sync_repository.dart',
    'lib/core/sync/sync_controller_provider.dart',
    'lib/core/sync/sync_registry.dart',
  ],
  replace: [
    {
      files: ['data/datasources/local/interfaces/category_local_datasource_service.dart'],
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY] as const,
    },
    {
      files: ['data/datasources/remote/interfaces/category_remote_datasource_service.dart'], 
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY] as const,
    },
  ],

   templated: [
    {
      // Путь к файлу-шаблону в исходном проекте (templProject)
      file: 'data/datasources/local/tables/category_table.dart',
      // Словари для простой замены (как в секции 'replace')
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY] as const,
      // Правила для генерации сложных секций
      sections: [
        {
          startMarker: '// === GENERATED_COLUMNS_START ===',
          endMarker: '// === GENERATED_COLUMNS_END ===',
          // Функция-генератор, которая создает контент для этой секции.
          // Она будет вызвана в GenerationService.
          generator: 'driftTableColumns', // Уникальное имя генератора
        }
      ]
    }
  ]
} as const;
