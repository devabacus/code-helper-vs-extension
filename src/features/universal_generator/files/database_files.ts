

export class DatabaseFiles {
    public static readonly staticFiles: string[] = [
        // t2/t2_flutter/lib/core/...
        'data/datasources/local/daos/sync_metadata_dao.dart',
        'data/datasources/local/datasources/sync_metadata_local_data_source.dart',
        'data/datasources/local/interfaces/i_database_service.dart',
        'data/datasources/local/interfaces/sync_metadata_local_datasource_service.dart',
        'data/datasources/local/providers/database_provider.dart',
        'data/datasources/local/services/database_service.dart',
        'data/datasources/local/tables/sync_metadata_table.dart',
        'data/datasources/local/database_types.dart',
        'sync/base_sync_repository.dart',
        'sync/sync_controller_provider.dart',
        'sync/sync_registry.dart',
    ];

    public static readonly simpleReplaceFiles: string[] = [
        'data/datasources/local/interfaces/category_local_datasource_service.dart',
        'data/datasources/remote/interfaces/category_remote_datasource_service.dart',
    ];
}
