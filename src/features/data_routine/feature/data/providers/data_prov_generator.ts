import * as path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class DataProviderGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataProvderPath(featurePath), entityName, `${entityName}_data_providers.dart`);
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(D);
    const ds = pluralConvert(d);

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../../core/database/local/provider/database_provider.dart';
import '../../../../../core/providers/session_manager_provider.dart';
import '../../../../../core/sync/sync_registry.dart';
import '../../../domain/repositories/${d}_repository.dart';
import '../../datasources/local/dao/${d}/${d}_dao.dart';
import '../../../../../core/database/local/daos/sync_metadata_dao.dart';
import '../../datasources/local/interfaces/${d}_local_datasource_service.dart';
import '../../../../../core/database/local/interface/sync_metadata_local_datasource_service.dart';
import '../../datasources/local/sources/${d}_local_data_source.dart';
import '../../../../../core/database/local/sources/sync_metadata_local_data_source.dart';
import '../../repositories/${d}_repository_impl.dart';
import '${d}_remote_data_providers.dart';

part '${d}_data_providers.g.dart';

@riverpod
${D}Dao ${d}Dao(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return ${D}Dao(databaseService);
}

@riverpod
I${D}LocalDataSource ${d}LocalDataSource(Ref ref) {
  final ${d}Dao = ref.read(${d}DaoProvider);
  return ${D}LocalDataSource(${d}Dao);
}

@riverpod
SyncMetadataDao syncMetadataDao(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return SyncMetadataDao(databaseService.database);
}

@riverpod
ISyncMetadataLocalDataSource syncMetadataLocalDataSource(Ref ref) {
  final syncMetadataDao = ref.read(syncMetadataDaoProvider);
  return SyncMetadataLocalDataSource(syncMetadataDao);
}

/// Семейный провайдер репозитория для конкретного пользователя
/// Каждый userId получает свой изолированный экземпляр репозитория
@riverpod
I${D}Repository ${d}Repository(Ref ref, int userId) {
  // ref.keepAlive();
  
  // Получаем все зависимости
  final localDataSource = ref.watch(${d}LocalDataSourceProvider);
  final remoteDataSource = ref.watch(${d}RemoteDataSourceProvider);
  final syncMetadataLocalDataSource = ref.watch(syncMetadataLocalDataSourceProvider);

  // Создаем репозиторий с фиксированным userId
  final repository = ${D}RepositoryImpl(
    localDataSource, 
    remoteDataSource, 
    syncMetadataLocalDataSource,
    userId, // Передаем userId в конструктор
  );

  // Автоматически регистрируем в реестре
  final registry = ref.read(syncRegistryProvider);
  registry.registerRepository('${ds}_$userId', repository);
  
  ref.onDispose(() {
    registry.unregisterRepository('${ds}_$userId');
    repository.dispose();
  });
  
  return repository;
}

/// Удобный провайдер для получения репозитория текущего пользователя
/// Автоматически следит за сменой пользователя и предоставляет соответствующий репозиторий
@riverpod
I${D}Repository? currentUser${D}Repository(Ref ref) {
  final currentUser = ref.watch(currentUserProvider);
  
  if (currentUser?.id == null) {
    // Если пользователь не авторизован, возвращаем null
    return null;
  }
  
  // Возвращаем репозиторий для текущего пользователя
  return ref.watch(${d}RepositoryProvider(currentUser!.id!));
}
`;
  }
}

