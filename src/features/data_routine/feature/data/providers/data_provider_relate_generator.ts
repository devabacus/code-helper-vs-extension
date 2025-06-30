import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { unCap, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

/**
 * Generates Riverpod providers for the Data layer of a many-to-many relation table.
 */
export class DataProviderRelateGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        // e.g., .../providers/task_tag_map/task_tag_map_relate_data_providers.dart
        return path.join(this.structure.getDataProvderPath(featurePath), toSnakeCase(entityName), `${toSnakeCase(entityName)}_relate_data_providers.dart`);
    }

    protected getContent(model: ServerpodModel): string {
        const Rel = model.className;    // TaskTagMap
        const rel = unCap(Rel);         // taskTagMap
        const relSnake = toSnakeCase(Rel); // task_tag_map

        return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../../core/database/local/provider/database_provider.dart';
import '../../../../../core/providers/session_manager_provider.dart';
import '../../../../../core/providers/serverpod_client_provider.dart';
import '../../../domain/repositories/${relSnake}_repository.dart';
import '../../datasources/local/dao/${relSnake}/${relSnake}_dao.dart';
import '../../datasources/local/interfaces/${relSnake}_local_datasource_service.dart';
import '../../datasources/local/sources/${relSnake}_local_data_source.dart';
import '../../repositories/${relSnake}_repository_impl.dart';

part '${relSnake}_relate_data_providers.g.dart';

@riverpod
${Rel}Dao ${rel}Dao(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return ${Rel}Dao(databaseService);
}

@riverpod
I${Rel}LocalDataSource ${rel}LocalDataSource(Ref ref) {
  final dao = ref.read(${rel}DaoProvider);
  return ${Rel}LocalDataSource(dao);
}

/// Family provider for the relation repository, specific to a user.
@riverpod
I${Rel}Repository ${rel}Repository(Ref ref, int userId) {
  // Get dependencies
  final localDataSource = ref.watch(${rel}LocalDataSourceProvider);
  final client = ref.watch(serverpodClientProvider);

  // Create the repository with a fixed userId
  final repository = ${Rel}RepositoryImpl(
    client,
    localDataSource,
    userId,
  );
  
  // No need for sync registry or dispose logic for this simple repository

  return repository;
}

/// Convenience provider to get the repository for the currently logged-in user.
@riverpod
I${Rel}Repository? currentUser${Rel}Repository(Ref ref) {
  final currentUser = ref.watch(currentUserProvider);
  
  if (currentUser?.id == null) {
    // If the user is not logged in, return null
    return null;
  }
  
  // Return the repository for the current user
  return ref.watch(${rel}RepositoryProvider(currentUser!.id!));
}
`;
    }
}