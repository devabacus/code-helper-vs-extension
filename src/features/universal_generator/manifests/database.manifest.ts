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
      dictionaries: ['common', 'entity'] as const,
    },
    {
      files: ['data/datasources/remote/interfaces/category_remote_datasource_service.dart'], 
      dictionaries: ['common', 'entity'] as const,
    },
  ],
} as const;
