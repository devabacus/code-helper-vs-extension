import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure"; //
import { pluralConvert, unCap, cap, toSnakeCase } from "../../../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator"; //
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { PathData } from "../../../../../../utils/path_util";
import { RelationAnalyzer } from "../../../../../serverpod_yaml_parser/relation-analyzer";

export class DataLocalSourcesGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getLocalDataSourcePath(featurePath), `${entityName}_local_data_source.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;
    const D = model.className;
    const d = unCap(model.className);
    const ds = pluralConvert(d);
    const Ds = pluralConvert(D);


    let foreignKeyMethods = '';
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);

    if (relationFields.length > 0) {
      foreignKeyMethods = relationFields.map(field => {
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;
        const parameterType = 'String';

        return `
  @override
  Future<List<${D}Model>> ${dsMethodName}(${parameterType} ${parameterName}, {required int userId, required String customerId}) async {
    final ${d}s = await _${d}Dao.${dsMethodName}(${parameterName}, userId: userId, customerId: customerId);
    return ${d}s.toModels();
  }`;
      }).join('\\n');
    }

    return `import 'package:drift/drift.dart';
import 'package:${projectName}_client/${projectName}_client.dart' as serverpod;
import 'package:uuid/uuid_value.dart';

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
  Future<List<${D}Model>> get${Ds}({
    required int userId,
    required String customerId,
  }) async {
    final categories = await _${d}Dao.get${Ds}(
      userId: userId,
      customerId: customerId,
    );
    return categories.toModels();
  }

  @override
  Stream<List<${D}Model>> watch${Ds}({
    required int userId,
    required String customerId,
  }) {
    return _${d}Dao
        .watch${Ds}(userId: userId, customerId: customerId)
        .map((list) => list.toModels());
  }

  @override
  Future<${D}Model?> get${D}ById(
    String id, {
    required int userId,
    required String customerId,
  }) async {
    try {
      final ${d} = await _${d}Dao.get${D}ById(
        id,
        userId: userId,
        customerId: customerId,
      );
      return ${d}?.toModel();
    } catch (e) {
      return null;
    }
  }

  @override
  Future<List<${D}Model>> get${Ds}ByIds(
    List<String> ids, {
    required int userId,
    required String customerId,
  }) async {
    final ${ds}Data = await _${d}Dao.get${Ds}ByIds(
      ids,
      userId: userId,
      customerId: customerId,
    );
    return ${ds}Data.toModels();
  }

  @override
  Future<String> create${D}(${D}Model ${d}) {
    final companion = ${d}.toCompanion().copyWith(
      syncStatus: const Value(SyncStatus.local),
    );
    return _${d}Dao.create${D}(companion);
  }

  @override
  Future<bool> update${D}(${D}Model ${d}) {
    final companion = ${d}.toCompanionWithId().copyWith(
      syncStatus: const Value(SyncStatus.local),
    );
    return _${d}Dao.update${D}(
      companion,
      userId: ${d}.userId,
      customerId: ${d}.customerId,
    );
  }

  @override
  Future<bool> delete${D}(
    String id, {
    required int userId,
    required String customerId,
  }) async {
    return _${d}Dao.softDelete${D}(id, userId: userId, customerId: customerId);
  }

  @override
  Future<List<${D}TableData>> getAllLocalChanges({
    required int userId,
    required String customerId,
  }) {
    return (_${d}Dao.select(_${d}Dao.${d}Table)..where(
      (t) =>
          (t.syncStatus.equals(SyncStatus.synced.name)).not() &
          t.userId.equals(userId) &
          t.customerId.equals(customerId),
    )).get();
  }

  @override
  Future<void> physicallyDelete${D}(
    String id, {
    required int userId,
    required String customerId,
  }) async {
    await _${d}Dao.physicallyDelete${D}(
      id,
      userId: userId,
      customerId: customerId,
    );
  }

  @override
  Future<void> insertOrUpdateFromServer(
    dynamic serverChange,
    SyncStatus status,
  ) async {
    await _${d}Dao.db
        .into(_${d}Dao.${d}Table)
        .insertOnConflictUpdate(
          (serverChange as serverpod.${D}).toCompanion(status),
        );
  }

  @override
  Future<List<${D}TableData>> reconcileServerChanges(
    List<dynamic> serverChanges, {
    required int userId,
    required String customerId,
  }) async {
    final allLocalChanges = await getAllLocalChanges(
      userId: userId,
      customerId: customerId,
    );
    final localChangesMap = {for (var c in allLocalChanges) c.id: c};

    await _${d}Dao.db.transaction(() async {
      for (final serverChange in serverChanges as List<serverpod.${D}>) {
        if (serverChange.userId != userId ||
            serverChange.customerId.toString() != customerId)
          continue;

        final localRecord =
            await (_${d}Dao.select(_${d}Dao.${d}Table)..where(
              (t) =>
                  t.id.equals(serverChange.id.toString()) &
                  t.userId.equals(userId) &
                  t.customerId.equals(customerId),
            )).getSingleOrNull();

        if (localRecord == null) {
          if (!serverChange.isDeleted) {
            await insertOrUpdateFromServer(serverChange, SyncStatus.synced);
            print('    -> СОЗДАНО с сервера: "\${serverChange.title}"');
          }
          continue;
        }

        final serverTime = serverChange.lastModified;
        final localTime = localRecord.lastModified;

        if (serverChange.isDeleted) {
          if (localTime.isAfter(serverTime) &&
              localRecord.syncStatus == SyncStatus.local) {
            print(
              '    -> КОНФЛИКТ: Локальная версия "\${localRecord.title}" новее серверного "надгробия". Локальное изменение побеждает.',
            );
          } else {
            print(
              '    -> ✅ Серверное "надгробие" новее или нет локального конфликта. Удаляем локальную запись: ID=\${localRecord.id}, Title="\${localRecord.title}".',
            );
            await physicallyDelete${D}(
              localRecord.id,
              userId: userId,
              customerId: customerId,
            );
            localChangesMap.remove(localRecord.id);
          }
        } else {
          if (localRecord.syncStatus == SyncStatus.local ||
              localRecord.syncStatus == SyncStatus.deleted) {
            if (serverTime.isAfter(localTime)) {
              print(
                '    -> КОНФЛИКТ: Сервер новее для "\${serverChange.title}". Применяем серверные изменения.',
              );
              await insertOrUpdateFromServer(serverChange, SyncStatus.synced);
              localChangesMap.remove(localRecord.id);
            } else {
              print(
                '    -> КОНФЛИКТ: Локальная версия новее для "\${localRecord.title}". Она будет отправлена на сервер.',
              );
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
  Future<void> handleSyncEvent(
    dynamic event, {
    required int userId,
    required String customerId,
  }) async {
    if (event is! serverpod.${D}SyncEvent) return;

    switch (event.type) {
      case serverpod.SyncEventType.create:
      case serverpod.SyncEventType.update:
        if (event.${d} != null &&
            event.${d}!.userId == userId &&
            event.${d}!.customerId == UuidValue.fromString(customerId)) {
          await insertOrUpdateFromServer(event.${d}!, SyncStatus.synced);
          print('  -> (Real-time) СОЗДАНА/ОБНОВЛЕНА: "\${event.${d}!.title}"');
        }
        break;
      case serverpod.SyncEventType.delete:
        if (event.id != null) {
          final localRecord =
              await (_${d}Dao.select(_${d}Dao.${d}Table)..where(
                (t) => t.id.equals(event.id!.toString()),
              )).getSingleOrNull();
          if (localRecord?.userId == userId &&
              localRecord?.customerId == customerId) {
            await physicallyDelete${D}(
              event.id!.toString(),
              userId: userId,
              customerId: customerId,
            );
            print('  -> (Real-time) УДАЛЕНА ID: "\${event.id}"');
          }
        }
        break;
    }
  }
  ${foreignKeyMethods}
}
  `;
  }
}


