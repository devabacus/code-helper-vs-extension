import path from "path";
import { BaseGenerator } from "../../../../../core/generators/base_generator";
import { DefaultProjectStructureLegacy } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, unCap } from "../../../../../utils/text_work/text_util";
import { PathData } from "../../../../utils/path_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class DataProviderRelateGenerator extends BaseGenerator<ServerpodModel> {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataProvderPath(featurePath), entityName, `${entityName}_data_providers.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;

    const d1 = model.fields[1].relatedModel!;
    const d2 = model.fields[2].relatedModel!;

    const D1 = cap(d1);
    const D1s = pluralConvert(D1);
    const D2 = cap(d2);
    const D2s = pluralConvert(D2);
    const ClassName = `${model.className}`;
    const ClassNameS = pluralConvert(ClassName);
    const className = unCap(ClassName);
    const tableName = `${model.tableName}`;

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../datasources/remote/interfaces/task_tag_map_remote_datasource_service.dart';
import '../../datasources/remote/sources/task_tag_map_remote_data_source.dart';
import '../../../../../core/database/local/interface/sync_metadata_local_datasource_service.dart';
import '../../../../../core/database/local/provider/database_provider.dart';
import '../../../../../core/database/local/sources/sync_metadata_local_data_source.dart';
import '../../../../../core/providers/serverpod_client_provider.dart';
import '../../../../../core/providers/session_manager_provider.dart';
import '../../../../../core/sync/sync_registry.dart';
import '../../../domain/repositories/${tableName}_repository.dart';
import '../../datasources/local/dao/${tableName}/${tableName}_dao.dart';
import '../../datasources/local/interfaces/${tableName}_local_datasource_service.dart';
import '../../datasources/local/sources/${tableName}_local_data_source.dart';
import '../../repositories/${tableName}_repository_impl.dart';
import '../../../../../core/database/local/daos/sync_metadata_dao.dart';
import '../${d2}/${d2}_data_providers.dart';

part '${tableName}_data_providers.g.dart';

@riverpod
${ClassName}Dao ${className}Dao(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return ${ClassName}Dao(databaseService);
}

@riverpod
I${ClassName}LocalDataSource ${className}LocalDataSource(Ref ref) {
  final dao = ref.read(${className}DaoProvider);
  return ${ClassName}LocalDataSource(dao);
}

@riverpod
I${ClassName}RemoteDataSource ${className}RemoteDataSource(Ref ref) {
  final client = ref.watch(serverpodClientProvider);
  return ${ClassName}RemoteDataSource(client);
}

@riverpod
ISyncMetadataLocalDataSource syncMetadataLocalDataSource(Ref ref) {
  final syncMetadataDao = ref.read(syncMetadataDaoProvider);
  return SyncMetadataLocalDataSource(syncMetadataDao);
}

@riverpod
SyncMetadataDao syncMetadataDao(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return SyncMetadataDao(databaseService.database);
}

/// Семейный провайдер репозитория для конкретного пользователя
@riverpod
I${ClassName}Repository ${className}Repository(Ref ref, {required int userId, required String customerId}) {
  // Получаем все зависимости
  final localDataSource = ref.watch(${className}LocalDataSourceProvider);
  final remoteDataSource = ref.watch(${className}RemoteDataSourceProvider);
  final syncMetadataLocalDataSource = ref.watch(
    syncMetadataLocalDataSourceProvider,
  );
  final ${d2}Repository = ref.watch(${d2}RepositoryProvider(userId: userId, customerId: customerId));

  // Создаем репозиторий с фиксированным userId
  final repository = ${ClassName}RepositoryImpl(
    localDataSource,
    remoteDataSource,
    syncMetadataLocalDataSource,
    userId,
    customerId,
    ${d2}Repository, //нужно для удаления ${tableName} при удалении ${d1}
  );

  // Регистрируем в реестре для автоматической синхронизации
  final registry = ref.read(syncRegistryProvider);
  final repoKey = '${tableName}s__\${userId}_$customerId';
  registry.registerRepository(repoKey, repository);

  // При уничтожении провайдера удаляем репозиторий из реестра
  ref.onDispose(() {
    registry.unregisterRepository(repoKey);
    repository.dispose();
  });

  return repository;
}

@riverpod
I${ClassName}Repository? currentUser${ClassName}Repository(Ref ref) {
  final currentUser = ref.watch(currentUserProvider);
  final currentCustomerId = ref.watch(currentCustomerIdProvider);

  if (currentUser?.id == null) {
    return null;
  }

  return ref.watch(${className}RepositoryProvider(userId: currentUser!.id!, customerId: currentCustomerId.toString()));
}
`;
  }
}