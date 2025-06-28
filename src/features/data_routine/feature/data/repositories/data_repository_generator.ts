import path from "path";
import { BaseGenerator } from "../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../core/interfaces/project_structure"; //
import { cap, pluralConvert, unCap } from "../../../../../utils/text_work/text_util"; //
import { PathData } from "../../../../utils/path_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/types";

export class DataRepositoryGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataRepositoryPath(featurePath), `${entityName}_repository_impl.dart`); //
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
       const projectName = new PathData(featurePath).projectName;
      const D = model.className;
      const d = unCap(model.className);
      const Ds = pluralConvert(D);
      const ds = pluralConvert(d);
      
  
      let foreignKeyMethods = '';
      const relationFields = model.fields.filter(field => field.isRelation && field.relationType === 'manyToOne');
  
      if (relationFields.length > 0) {
        foreignKeyMethods = relationFields.map(field => {
          const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
          const methodNamePart = cap(field.name.replace(/Id$/, ''));
          const dsMethodName = `get${Ds}By${methodNamePart}Id`;
          const parameterName = fkFieldName;
          const parameterType = 'String';
  
          return `
  @override
  Future<List<${D}Entity>> ${dsMethodName}(${parameterType} ${parameterName}, {required int userId}) async {
    final ${d}s = await _${d}Dao.${dsMethodName}(${parameterName}, userId: userId);
    return ${d}s.map((e) => e.toEntity()).toList();
  }`;
      }).join('\\n');
      }
  
      return `import 'package:${projectName}/features/home/data/datasources/local/tables/extensions/${d}_table_extension.dart';
import 'package:${projectName}/features/home/domain/entities/extensions/${d}_entity_extension.dart';
import 'package:${projectName}_client/${projectName}_client.dart' as serverpod;

import '../../../../core/database/local/database.dart';
import '../../../../core/sync/base_sync_repository.dart';
import '../../domain/entities/${d}/${d}.dart';
import '../../domain/repositories/${d}_repository.dart';
import '../../../../core/database/local/database_types.dart';
import '../datasources/local/interfaces/${d}_local_datasource_service.dart';
import '../../../../core/database/local/interface/sync_metadata_local_datasource_service.dart';
import '../datasources/remote/interfaces/${d}_remote_datasource_service.dart';
import '../models/extensions/${d}_model_extension.dart';

class ${D}RepositoryImpl extends BaseSyncRepository
    implements I${D}Repository {
  final I${D}LocalDataSource _localDataSource;
  final I${D}RemoteDataSource _remoteDataSource;
  final ISyncMetadataLocalDataSource _syncMetadataDataSource;

  @override
  String get entityTypeName => '${D}';
  @override
  String get entityType => '${ds}_user_$userId';

  ${D}RepositoryImpl(
    this._localDataSource,
    this._remoteDataSource,
    this._syncMetadataDataSource,
    int userId,
  ) : super(userId) {
    print('✅ ${D}RepositoryImpl: Создан экземпляр для userId: $userId');
    initEventBasedSync();
  }

  @override
  Future<List<serverpod.${D}>> getChangesFromServer(DateTime? since) {
    return _remoteDataSource.get${Ds}Since(since);
  }

  @override
  Future<List<dynamic>> reconcileChanges(
      List<dynamic> serverChanges) async {
    return _localDataSource.reconcileServerChanges(serverChanges, userId);
  }

  @override
  Future<void> pushLocalChanges(List<dynamic> localChangesToPush) async {
    for (final localChange in localChangesToPush as List<${D}TableData>) {
      if (localChange.syncStatus == SyncStatus.deleted) {
        try {
          await _syncDeleteToServer(localChange.id);
          await _localDataSource.physicallyDelete${D}(localChange.id,
              userId: userId);
          print(
              '    -> ✅ Удаление "\${localChange.id}" синхронизировано с сервером.');
        } catch (e) {
          print(
              '    -> ⚠️ Не удалось синхронизировать удаление ID: \${localChange.id}. Повторим позже.');
        }
      } else if (localChange.syncStatus == SyncStatus.local) {
        try {
          final entity = localChange.toModel().toEntity();
          final serverRecord = await _remoteDataSource
              .get${D}ById(serverpod.UuidValue.fromString(entity.id));
          if (serverRecord != null && !serverRecord.isDeleted) {
            await _syncUpdateToServer(entity);
          } else {
            await _syncCreateToServer(entity);
          }
          print(
              '    -> ✅ Изменение "\${localChange.title}" синхронизировано с сервером.');
        } catch (e) {
          print(
              '    -> ⚠️ Не удалось синхронизировать изменение ID: \${localChange.id}. Повторим позже.');
        }
      }
    }
  }

  @override
  Future<DateTime?> getLastSyncTimestamp() =>
      _syncMetadataDataSource.getLastSyncTimestamp(entityType, userId: userId);

  @override
  Future<void> updateLastSyncTimestamp() => _syncMetadataDataSource
      .updateLastSyncTimestamp(entityType, DateTime.now().toUtc(), userId: userId);

  @override
  Stream<serverpod.${D}SyncEvent> watchEvents() =>
      _remoteDataSource.watchEvents();

  @override
  Future<void> handleSyncEvent(dynamic event) async {
    await _localDataSource.handleSyncEvent(event, userId);
  }

  @override
  Stream<List<${D}Entity>> watch${Ds}() {
    return _localDataSource
        .watch${Ds}(userId: userId)
        .map((models) => models.toEntities());
  }

  @override
  Future<String> create${D}(${D}Entity ${d}) async {
    final ${d}WithUser = ${d}.copyWith(userId: userId);
    final id = await _localDataSource.create${D}(${d}WithUser.toModel());
    syncWithServer().catchError(
        (e) => print('⚠️ Фоновая синхронизация после создания не удалась: $e'));
    return id;
  }

  @override
  Future<bool> update${D}(${D}Entity ${d}) async {
    final ${d}WithUser =
        ${d}.copyWith(userId: userId, lastModified: DateTime.now().toUtc());
    final result =
        await _localDataSource.update${D}(${d}WithUser.toModel());
    syncWithServer().catchError(
        (e) => print('⚠️ Фоновая синхронизация после обновления не удалась: $e'));
    return result;
  }

  @override
  Future<bool> delete${D}(String id) async {
    final result = await _localDataSource.delete${D}(id, userId: userId);
    syncWithServer().catchError(
        (e) => print('⚠️ Фоновая синхронизация после удаления не удалась: $e'));
    return result;
  }

  @override
  Future<List<${D}Entity>> get${Ds}() async =>
      _localDataSource
          .get${Ds}(userId: userId)
          .then((models) => models.toEntities());

  @override
  Future<${D}Entity?> get${D}ById(String id) async {
    final model = await _localDataSource.get${D}ById(id, userId: userId);
    return model?.toEntity();
  }

  Future<void> _syncCreateToServer(${D}Entity ${d}) async {
    try {
      final server${D} = ${d}.toServerpod${D}();
      final synced${D} =
          await _remoteDataSource.create${D}(server${D});
      await _localDataSource.insertOrUpdateFromServer(
          synced${D}, SyncStatus.synced);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> _syncUpdateToServer(${D}Entity ${d}) async {
    try {
      final server${D} = ${d}.toServerpod${D}();
      await _remoteDataSource.update${D}(server${D});
      await _localDataSource.insertOrUpdateFromServer(
          server${D}, SyncStatus.synced);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> _syncDeleteToServer(String id) async {
    try {
      await _remoteDataSource.delete${D}(serverpod.UuidValue.fromString(id));
    } catch (e) {
      rethrow;
    }
  }
}

extension on ${D}Entity {
  serverpod.${D} toServerpod${D}() => serverpod.${D}(
        id: serverpod.UuidValue.fromString(id),
        title: title,
        lastModified: lastModified,
        userId: userId,
        isDeleted: false,
      );
      ${foreignKeyMethods}
}`;
    }

}