import path from "path";
import { BaseGenerator } from "../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, unCap, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { PathData } from "../../../../utils/path_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class DataRepositoryRelateImplGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataRepositoryPath(featurePath), `${entityName}_repository_impl.dart`);
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

    return `import 'package:drift/drift.dart';
import 'package:${projectName}/features/home/data/datasources/local/tables/extensions/${tableName}_table_extension.dart';
import 'package:${projectName}/features/home/domain/entities/extensions/${tableName}_entity_extension.dart';
import 'package:${projectName}_client/${projectName}_client.dart' as serverpod;
import 'package:uuid/uuid.dart';

import '../../../../core/database/local/database.dart';
import '../../../../core/database/local/database_types.dart';
import '../../../../core/database/local/interface/sync_metadata_local_datasource_service.dart';
import '../../../../core/sync/base_sync_repository.dart';
import '../../domain/entities/${d2}/${d2}_entity.dart';
import '../../domain/entities/${d1}/${d1}_entity.dart';
import '../../domain/entities/${tableName}/${tableName}_entity.dart';
import '../../domain/repositories/${d2}_repository.dart';
import '../../domain/repositories/${tableName}_repository.dart';
import '../datasources/local/interfaces/${tableName}_local_datasource_service.dart';
import '../datasources/remote/interfaces/${tableName}_remote_datasource_service.dart';
import '../models/extensions/${d1}_model_extension.dart';
import '../models/extensions/${tableName}_model_extension.dart';

class ${ClassName}RepositoryImpl extends BaseSyncRepository
    implements I${ClassName}Repository {
  final I${ClassName}LocalDataSource _localDataSource;
  final I${ClassName}RemoteDataSource _remoteDataSource;
  final I${D2}Repository _${d2}Repository;

  @override
  String get entityTypeName => '${ClassName}';
  @override
  String get entityType => '${tableName}s_user_$userId';

  ${ClassName}RepositoryImpl(
    this._localDataSource,
    this._remoteDataSource,
    ISyncMetadataLocalDataSource syncMetadataDataSource,
    int userId,
    String customerId,
    this._${d2}Repository,
  ) : super(userId, customerId, syncMetadataDataSource: syncMetadataDataSource) {
    print('✅ ${ClassName}RepositoryImpl: Создан экземпляр для userId: $userId');
    initEventBasedSync();
  }

  @override
  Stream<List<${ClassName}Entity>> watch${ClassNameS}() {
    return _localDataSource
        .watchAllRelations(userId: userId, customerId: customerId)
        .map((models) => models.toEntities());
  }

  @override
  Future<String> create${ClassName}(${ClassName}Entity ${className}) async {
    final id = await _localDataSource.create${ClassName}(${className}.toModel());
    syncWithServer().catchError(
      (e) =>
          print('⚠️ Фоновая синхронизация после создания связи не удалась: $e'),
    );
    return id;
  }

  @override
  Future<bool> delete${ClassName}(${ClassName}Entity ${className}) async {
   final result = await _localDataSource.updateTaskTagMap(taskTagMap.toModel());
    syncWithServer().catchError(
      (e) =>
          print('⚠️ Фоновая синхронизация после удаления связи не удалась: $e'),
    );
    return result;
  }

  @override
  Future<void> add${D2}To${D1}({
    required String ${d1}Id,
    required String ${d2}Id,
  }) async {
    final newRelation = ${ClassName}Entity(
      id: const Uuid().v7(),
      userId: userId,
      customerId: customerId,
      createdAt: DateTime.now().toUtc(),
      lastModified: DateTime.now().toUtc(),
      ${d1}Id: ${d1}Id,
      ${d2}Id: ${d2}Id,
    );
    await create${ClassName}(newRelation);
  }

  @override
  Future<void> remove${D2}From${D1}({
    required String ${d1}Id,
    required String ${d2}Id,
  }) async {
    try {
      // Находим связь по ${d1}Id и ${d2}Id
      final relation = await _localDataSource.getRelationBy${D1}And${D2}(
        ${d1}Id,
        ${d2}Id,
        userId: userId,
        customerId: customerId,
      );

      if (relation != null) {
        // Удаляем связь по найденному ID
        await delete${ClassName}(relation.copyWith(isDeleted: true).toEntity());
        print('✅ Связь найдена и удалена: ${D1}($${d1}Id) ↔ ${D2}($${d2}Id)');
      } else {
        print('⚠️ Связь не найдена: ${D1}($${d1}Id) ↔ ${D2}($${d2}Id)');
      }
    } catch (e) {
      print('❌ Ошибка удаления связи ${D1}($${d1}Id) ↔ ${D2}($${d2}Id): $e');
      rethrow;
    }
  }

  @override
  Future<void> removeAll${D2s}From${D1}(String ${d1}Id) async {
    try {
      final companion = TaskTagMapTableCompanion(
      isDeleted: const Value(true),
      lastModified: Value(DateTime.now().toUtc()),
      syncStatus: const Value(SyncStatus.local),
  );

      await _localDataSource.updateRelationsBy${D1}Id(
        ${d1}Id,
        companion,
        userId: userId,
        customerId: customerId,
      );
      print('✅ Все связи для источника $${d1}Id помечены для удаления локально.');
      // Запускаем фоновую синхронизацию, чтобы сервер узнал об удалениях
      syncWithServer().catchError(
        (e) => print(
          '⚠️ Фоновая синхронизация после очистки тегов не удалась: $e',
        ),
      );
    } catch (e) {
      print('❌ Ошибка при удалении всех записей $${d1}Id: $e');
      rethrow;
    }
  }

  @override
  Future<List<${D2}Entity>> get${D2s}For${D1}(String ${d1}Id) async {
    final allRelations =
        await _localDataSource.watchAllRelations(userId: userId, customerId: customerId).first;

    final ${d2}IdsFor${D1} =
        allRelations
            .where((relation) => relation.${d1}Id == ${d1}Id)
            .map((relation) => relation.${d2}Id)
            .toList();

    if (${d2}IdsFor${D1}.isEmpty) {
      return [];
    }
    return _${d2}Repository.get${D2s}ByIds(${d2}IdsFor${D1});
  }

  @override
  Future<List<${D1}Entity>> get${D1s}For${D2}(String ${d2}Id) async {
    final server${D1s} = await _remoteDataSource.get${D1s}For${D2}(
      serverpod.UuidValue.fromString(${d2}Id),
    );
    return server${D1s}.toModels().toEntities();
  }

  @override
  Future<List<dynamic>> getChangesFromServer(DateTime? since) {
    return _remoteDataSource.get${ClassNameS}Since(since);
  }

  @override
  Future<List<dynamic>> reconcileChanges(List<dynamic> serverChanges) {
    return _localDataSource.reconcileServerChanges(serverChanges, userId: userId, customerId: customerId);
  }

  @override
  Future<void> pushLocalChanges(List<dynamic> localChangesToPush) async {
    for (final localChange in localChangesToPush as List<${ClassName}TableData>) {
      if (localChange.isDeleted) {
        try {
          // Вместо удаления по локальному ID, удаляем по бизнес-ключу
          await _syncDeleteBy${D1}And${D2}(localChange.${d1}Id, localChange.${d2}Id);
          await _localDataSource.physicallyDelete${ClassName}(
            localChange.id,
            userId: userId,
            customerId: customerId,
          );
          print(
            '    -> ✅ Удаление связи для ${D1} \${localChange.${d1}Id.substring(0, 8)}... синхронизировано с сервером.',
          );
        } catch (e) {
          print(
            '    -> ⚠️ Не удалось синхронизировать удаление связи для ${D1}: \${localChange.${d1}Id}. Повторим позже. Ошибка: $e',
          );
        }
      } else if (localChange.syncStatus == SyncStatus.local) {
        try {
          final syncedEntity = await _syncCreateToServer(
            localChange.toModel().toEntity(),
          );
          await _localDataSource.insertOrUpdateFromServer(
            syncedEntity,
            SyncStatus.synced,
          );
          print(
            '    -> ✅ Создание/обновление связи ID \${localChange.id.substring(0, 8)}... синхронизировано с сервером.',
          );
        } catch (e) {
          print(
            '    -> ⚠️ Не удалось синхронизировать создание/обновление связи ID: \${localChange.id}. Повторим позже. Ошибка: $e',
          );
        }
      }
    }
  }

  // Новый вспомогательный метод для вызова удаления по ${D1} и ${D2} ID
  Future<void> _syncDeleteBy${D1}And${D2}(String ${d1}Id, String ${d2}Id) async {
    await _remoteDataSource.delete${ClassName}By${D1}And${D2}(
      serverpod.UuidValue.fromString(${d1}Id),
      serverpod.UuidValue.fromString(${d2}Id),
    );
  }

  Future<serverpod.${ClassName}> _syncCreateToServer(
    ${ClassName}Entity entity,
  ) async {
    return await _remoteDataSource.create${ClassName}(entity.toServerpod${ClassName}());
  }  

  @override
  Stream<dynamic> watchEvents() => _remoteDataSource.watchEvents();

  @override
  Future<void> handleSyncEvent(dynamic event) async {
    await _localDataSource.handleSyncEvent(event, userId: userId, customerId: customerId);
  }

  @override
  Future<${ClassName}Entity?> get${ClassName}ById(String id) async {
    final model = await _localDataSource.getRelationById(id, userId: userId, customerId: customerId);
    return model?.toEntity();
  }

  @override
  Future<bool> update${ClassName}(${ClassName}Entity ${className}) async {
    final result = await _localDataSource.update${ClassName}(
      ${className}.toModel(),
    );
    syncWithServer().catchError(
      (e) => print(
        '⚠️ Фоновая синхронизация после обновления связи не удалась: $e',
      ),
    );
    return result;
  }
}`;
  }
}