import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure"; //
import { pluralConvert, unCap, cap, toSnakeCase } from "../../../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator"; //
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/types";

export class DataLocalRelateSourceGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    // entityName is intermediate table name like "taskTagMap"
    const snakeCaseEntityName = toSnakeCase(entityName);
    return path.join(this.structure.getLocalDataSourcePath(featurePath), `${snakeCaseEntityName}_local_data_source.dart`);
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    // Генерация методов для получения по внешнему ключу
    let foreignKeyMethods = '';
    const relationFields = model.fields.filter(field => field.isRelation && field.relationType === 'manyToOne');

    if (relationFields.length > 0) {
      foreignKeyMethods = relationFields.map(field => {
        const fieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const daoMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fieldName;
        const parameterType = 'String';

        return `
  Future<List<${D}TableData>> ${daoMethodName}(${parameterType} ${parameterName}, {required int userId}) =>
    (select(${d}Table)
      ..where((t) => t.${parameterName}.equals(${parameterName}) & t.userId.equals(userId) & t.syncStatus.equals(SyncStatus.deleted.name).not()))
    .get();`;
      }).join('\n');
    }

    return `import 'package:drift/drift.dart';
import 'package:sync1_client/sync1_client.dart' as serverpod;

import '../../../../../../core/database/local/database.dart';
import '../../../datasources/local/tables/extensions/${d}_table_extension.dart';
import '../../../models/${d}/${d}_model.dart';
import '../../../models/extensions/${d}_model_extension.dart';
import '../../../../../../core/database/local/database_types.dart';
import '../dao/${d}/${d}_dao.dart';
import '../interfaces/${d}_local_datasource_service.dart';

class ${D}LocalDataSource implements I${D}LocalDataSource {
  final ${D}Dao _${d}Dao;

  ${D}LocalDataSource(this._${d}Dao);

  @override
  Future<List<${D}Model>> get${Ds}({int? userId}) async {
    final categories = await _${d}Dao.get${Ds}(userId: userId);
    return categories.toModels();
  }

  @override
  Stream<List<${D}Model>> watch${Ds}({int? userId}) {
    return _${d}Dao
        .watch${Ds}(userId: userId)
        .map((list) => list.toModels());
  }

  @override
  Future<${D}Model?> get${D}ById(String id,
      {required int userId}) async {
    try {
      final ${d} = await _${d}Dao.get${D}ById(id, userId: userId);
      return ${d}.toModel();
    } catch (e) {
      return null;
    }
  }

  @override
  Future<String> create${D}(${D}Model ${d}) {
    final companion =
        ${d}.toCompanion().copyWith(syncStatus: const Value(SyncStatus.local));
    return _${d}Dao.create${D}(companion);
  }

  @override
  Future<bool> update${D}(${D}Model ${d}) {
    final companion = ${d}
        .toCompanionWithId()
        .copyWith(syncStatus: const Value(SyncStatus.local));
    return _${d}Dao.update${D}(companion, userId: ${d}.userId);
  }

  @override
  Future<bool> delete${D}(String id, {required int userId}) async {
    return _${d}Dao.softDelete${D}(id, userId: userId);
  }

  @override
  Future<List<${D}TableData>> getAllLocalChanges(int userId) {
    return (_${d}Dao.select(_${d}Dao.${d}Table)
          ..where((t) =>
              (t.syncStatus.equals(SyncStatus.synced.name)).not() &
              t.userId.equals(userId)))
        .get();
  }

  @override
  Future<void> physicallyDelete${D}(String id, {required int userId}) async {
    await _${d}Dao.physicallyDelete${D}(id, userId: userId);
  }

  @override
  Future<void> insertOrUpdateFromServer(
      dynamic serverChange, SyncStatus status) async {
    await _${d}Dao.db
        .into(_${d}Dao.${d}Table)
        .insertOnConflictUpdate(
          (serverChange as serverpod.${D}).toCompanion(status),
        );
  }

  @override
  Future<List<${D}TableData>> reconcileServerChanges(
      List<dynamic> serverChanges, int userId) async {
    final allLocalChanges = await getAllLocalChanges(userId);
    final localChangesMap = {for (var c in allLocalChanges) c.id: c};

    await _${d}Dao.db.transaction(() async {
      for (final serverChange in serverChanges as List<serverpod.${D}>) {
        if (serverChange.userId != userId) continue;

        final localRecord = await (_${d}Dao.select(_${d}Dao.${d}Table)
              ..where((t) => t.id.equals(serverChange.id.toString())))
            .getSingleOrNull();

        if (localRecord == null) {
          if (!serverChange.isDeleted) {
            await insertOrUpdateFromServer(serverChange, SyncStatus.synced);
            print('    -> СОЗДАНО с сервера: "\${serverChange.title}"');
          }
          continue;
        }

        final serverTime =
            serverChange.lastModified ?? DateTime.fromMicrosecondsSinceEpoch(0);
        final localTime = localRecord.lastModified;

        if (serverChange.isDeleted) {
          if (localTime.isAfter(serverTime) &&
              localRecord.syncStatus == SyncStatus.local) {
            print(
                '    -> КОНФЛИКТ: Локальная версия "\${localRecord.title}" новее серверного "надгробия". Локальное изменение побеждает.');
          } else {
            print(
                '    -> ✅ Серверное "надгробие" новее или нет локального конфликта. Удаляем локальную запись: ID=\${localRecord.id}, Title="\${localRecord.title}".');
            await physicallyDelete${D}(localRecord.id, userId: userId);
            localChangesMap.remove(localRecord.id);
          }
        } else {
          if (localRecord.syncStatus == SyncStatus.local ||
              localRecord.syncStatus == SyncStatus.deleted) {
            if (serverTime.isAfter(localTime)) {
              print(
                  '    -> КОНФЛИКТ: Сервер новее для "\${serverChange.title}". Применяем серверные изменения.');
              await insertOrUpdateFromServer(serverChange, SyncStatus.synced);
              localChangesMap.remove(localRecord.id);
            } else {
              print(
                  '    -> КОНФЛИКТ: Локальная версия новее для "\${localRecord.title}". Она будет отправлена на сервер.');
            }
          } else {
            await insertOrUpdateFromServer(serverChange, SyncStatus.synced);
            print('    -> ОБНОВЛЕНО с сервера: "\${serverChange.title}"');
          }
        }
      }
    });
    return localChangesMap.values.toList();
  }

  @override
  Future<void> handleSyncEvent(dynamic event, int userId) async {
    if (event is! serverpod.${D}SyncEvent) return;

    switch (event.type) {
      case serverpod.SyncEventType.create:
      case serverpod.SyncEventType.update:
        if (event.${d} != null && event.${d}!.userId == userId) {
          await insertOrUpdateFromServer(event.${d}!, SyncStatus.synced);
          print(
              '  -> (Real-time) СОЗДАНА/ОБНОВЛЕНА: "\${event.${d}!.title}"');
        }
        break;
      case serverpod.SyncEventType.delete:
        if (event.id != null) {
          final localRecord = await (_${d}Dao.select(_${d}Dao.${d}Table)
                ..where((t) => t.id.equals(event.id!.toString())))
              .getSingleOrNull();
          if (localRecord?.userId == userId) {
            await physicallyDelete${D}(event.id!.toString(), userId: userId);
            print('  -> (Real-time) УДАЛЕНА ID: "\${event.id}"');
          }
        }
        break;
    }
  }
}
  `;
  }
}


