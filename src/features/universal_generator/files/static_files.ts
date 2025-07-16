import { IWorkspaceStructure } from "../project_structure/interfaces/i_workspace_structure";

export const DATABASE_STATIC_FILES = [
   't2/t2_flutter/lib/core/data/datasources/local/daos/sync_metadata_dao.dart',
   't2/t2_flutter/lib/core/data/datasources/local/datasources/sync_metadata_local_data_source.dart',
   't2/t2_flutter/lib/core/data/datasources/local/interfaces/i_database_service.dart',
   't2/t2_flutter/lib/core/data/datasources/local/interfaces/sync_metadata_local_datasource_service.dart',
   't2/t2_flutter/lib/core/data/datasources/local/providers/database_provider.dart',
   't2/t2_flutter/lib/core/data/datasources/local/services/database_service.dart',
   't2/t2_flutter/lib/core/data/datasources/local/tables/sync_metadata_table.dart',
   't2/t2_flutter/lib/core/data/datasources/local/database_types.dart',
   't2/t2_flutter/lib/core/sync/base_sync_repository.dart',
   't2/t2_flutter/lib/core/sync/sync_controller_provider.dart',
   't2/t2_flutter/lib/core/sync/sync_registry.dart',
];

export const AUTH_STATIC_FILES = [
   't2/t2_flutter/lib/core/providers/serverpod_client_provider.dart',
   't2/t2_flutter/lib/core/providers/session_manager_provider.dart',
];

export const NAVIGATION_STATIC_FILES = [
   't2/t2_flutter/lib/core/services/navigation_service.dart',
   't2/t2_flutter/lib/core/providers/navigation_provider.dart',
   't2/t2_flutter/lib/core/routing/router_config.dart',
   't2/t2_flutter/lib/core/routing/routes_constants.dart',
];

export const GENERAL_STATIC_FILES = [

   't2/t2_flutter/lib/core/config/config.dart',

   't2/t2_flutter/lib/core/services/api/api_client.dart',
   't2/t2_flutter/lib/core/providers/api_provider.dart',

   't2/t2_flutter/lib/core/providers/logger_provider.dart',
];





export const STATIC_FILES = [
   ...GENERAL_STATIC_FILES,
   ...NAVIGATION_STATIC_FILES,
   ...DATABASE_STATIC_FILES,

];
