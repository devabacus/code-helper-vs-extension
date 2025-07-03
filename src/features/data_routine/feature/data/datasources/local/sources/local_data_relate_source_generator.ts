import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, unCap, toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";
import { PathData } from "../../../../../../utils/path_util";

/**
 * Generates a Local Data Source for a many-to-many relation table.
 * It's a simple wrapper around the corresponding DAO.
 */
export class DataLocalRelateSourceGenerator extends BaseGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getLocalDataSourcePath(featurePath), `${toSnakeCase(entityName)}_local_data_source.dart`);
    }

    protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
        const projectName = new PathData(featurePath).projectName;
        const d1 = model.fields[1].relatedModel!;
        const d2 = model.fields[2].relatedModel!;       

        const D1 = cap(d1);
        const D2 = cap(d2);
        const ClassName = `${model.className}`; 
        const tableName = `${model.tableName}`;

        return `
import 'package:drift/drift.dart';
import 'package:${projectName}_client/${projectName}_client.dart' as serverpod;

import '../../../../../../core/database/local/database.dart';
import '../../../../../../core/database/local/database_types.dart';
import '../../../models/${tableName}/${tableName}_model.dart';
import '../dao/${tableName}/${tableName}_dao.dart';
import '../interfaces/${tableName}_local_datasource_service.dart';
import '../tables/extensions/${tableName}_table_extension.dart';
import '../../../models/extensions/${tableName}_model_extension.dart';

class ${ClassName}LocalDataSource implements I${ClassName}LocalDataSource {
  final ${ClassName}Dao _dao;

  ${ClassName}LocalDataSource(this._dao);

  @override
  Future<String> create${ClassName}(${ClassName}Model model) {
    return _dao.create${ClassName}(model.toCompanion().copyWith(syncStatus: const Value(SyncStatus.local)));
  }

  @override
  Future<bool> update${ClassName}(${ClassName}Model model) {
    return _dao.update${ClassName}(model.toCompanionWithId().copyWith(syncStatus: const Value(SyncStatus.local)), userId: model.userId);
  }

  @override
  Future<bool> softDelete${ClassName}ById(String id, {required int userId}) {
    return _dao.softDelete${ClassName}ById(id, userId: userId);
  }

  @override
  Future<int> softDeleteRelationsBy${D1}Id(String ${d1}Id, {required int userId}) {
    return _dao.softDeleteRelationsBy${D1}Id(${d1}Id, userId: userId);
  }

  @override
  Future<${ClassName}Model?> getRelationById(String id, {required int userId}) async {
    final result = await _dao.getRelationById(id, userId: userId);
    return result?.toModel();
  }
  
@override
Future<${ClassName}Model?> getRelationBy${D1}And${D2}(String ${d1}Id, String ${d2}Id, {required int userId}) async {
  final result = await _dao.getRelationBy${D1}And${D2}(${d1}Id, ${d2}Id, userId: userId);
  return result?.toModel();
}

  @override
  Stream<List<${ClassName}Model>> watchAllRelations({required int userId}) {
    return _dao.watchAllRelations(userId: userId).map((list) => list.toModels());
  }
  
  @override
  Future<List<${ClassName}TableData>> getAllLocalChanges(int userId) {
    return (_dao.select(_dao.${d1}${D2}MapTable)
          ..where((t) =>
              (t.syncStatus.equals(SyncStatus.synced.name)).not() &
              t.userId.equals(userId)))
        .get();
  }

  @override
  Future<int> physicallyDelete${ClassName}(String id, {required int userId}) {
    return _dao.physicallyDelete${ClassName}(id, userId: userId);
  }
 @override
  Future<void> insertOrUpdateFromServer(dynamic serverChange, SyncStatus status) async {
    final server${ClassName} = serverChange as serverpod.${ClassName};

    // Оборачиваем в транзакцию для атомарности
    await _dao.db.transaction(() async {
      // 1. Ищем, существует ли локальная запись для этой *связи* (по ${d1}Id и ${d2}Id).
      //    У нее может быть другой, "неправильный" ID.
      final existingRecord = await (_dao.select(_dao.${d1}${D2}MapTable)
            ..where((t) =>
                t.${d1}Id.equals(server${ClassName}.${d1}Id.toString()) &
                t.${d2}Id.equals(server${ClassName}.${d2}Id.toString()) &
                t.userId.equals(server${ClassName}.userId)))
          .getSingleOrNull();

      // 2. Если такая запись существует, мы должны ее физически удалить,
      //    чтобы избежать конфликта уникальности и освободить место для авторитетной записи с сервера.
      if (existingRecord != null) {
        await _dao.physicallyDelete${ClassName}(existingRecord.id, userId: existingRecord.userId);
        print('    -> Удалена устаревшая локальная связь: \${existingRecord.id}');
      }

      // 3. Вставляем новую, авторитетную запись с сервера с правильным ID.
      //    Это гарантирует, что все клиенты будут иметь одинаковую запись с одинаковым ID.
      final companion = server${ClassName}.toCompanion(status);
      await _dao.db.into(_dao.${d1}${D2}MapTable).insert(companion);
      print('    -> СОЗДАНА/ОБНОВЛЕНА связь с сервера: \${server${ClassName}.id}');
    });
  }

  @override
  Future<void> handleSyncEvent(dynamic event, int userId) async {
    if (event is! serverpod.${ClassName}SyncEvent) return;

    switch (event.type) {
      case serverpod.SyncEventType.create:
      case serverpod.SyncEventType.update:
        final ${d1}${D2}Map = event.${d1}${D2}Map;
        if (${d1}${D2}Map != null && ${d1}${D2}Map.userId == userId) {
          // Сервер сообщает нам об удалении, присылая запись с флагом isDeleted = true.
          // Мы обрабатываем это как "мягкое" удаление.
          if (${d1}${D2}Map.isDeleted) {
            print('  -> (Real-time) Получено событие мягкого удаления для ID: \${${d1}${D2}Map.id}');
            await softDelete${ClassName}ById(${d1}${D2}Map.id.toString(), userId: userId);
          } else {
            // В противном случае это обычное создание/обновление.
            print('  -> (Real-time) Получено событие создания/обновления для ID: \${${d1}${D2}Map.id}');
            await insertOrUpdateFromServer(${d1}${D2}Map, SyncStatus.synced);
          }
        }
        break;
      
      // Этот кейс обрабатывает "жесткое" удаление. Наша логика теперь его не использует,
      // но для надежности оставим обработчик, который тоже будет делать "мягкое" удаление.
      case serverpod.SyncEventType.delete:
        if (event.id != null) {
          print('  -> (Real-time) Получено событие жесткого удаления для ID: \${event.id}');
          await softDelete${ClassName}ById(event.id.toString(), userId: userId);
        }
        break;
    }
  }

  @override
  Future<List<${ClassName}TableData>> reconcileServerChanges(List<dynamic> serverChanges, int userId) async {
    final localChanges = await getAllLocalChanges(userId);
    final localChangesMap = {for (var c in localChanges) c.id: c};

    await _dao.db.transaction(() async {
      for (final serverChange in serverChanges as List<serverpod.${ClassName}>) {
        if (serverChange.userId != userId) continue;
        
        final localRecord = await (_dao.select(_dao.${d1}${D2}MapTable)
              ..where((t) => t.id.equals(serverChange.id.toString())))
            .getSingleOrNull();

        final serverTime = serverChange.lastModified ?? DateTime.fromMicrosecondsSinceEpoch(0);

        if (localRecord == null) {
          if (!serverChange.isDeleted) {
            await insertOrUpdateFromServer(serverChange, SyncStatus.synced);
            print('    -> СОЗДАНА с сервера: Связь ID \${serverChange.id}');
          }
          continue;
        }

        final localTime = localRecord.lastModified;

        if (serverChange.isDeleted) {
           if (localTime.isAfter(serverTime) && localRecord.syncStatus == SyncStatus.local) {
              print('    -> КОНФЛИКТ: Локальная версия связи ID \${localRecord.id} новее серверного "надгробия". Локальное изменение побеждает.');
           } else {
              print('    -> ✅ Серверное "надгробие" новее или нет локального конфликта. Удаляем локальную запись: ID=\${localRecord.id}.');
              await physicallyDelete${ClassName}(localRecord.id, userId: userId);
              localChangesMap.remove(localRecord.id);
           }
        } else {
          if (localRecord.syncStatus == SyncStatus.local || localRecord.syncStatus == SyncStatus.deleted) {
            if (serverTime.isAfter(localTime)) {
              print('    -> КОНФЛИКТ: Сервер новее для связи ID \${serverChange.id}. Применяем серверные изменения.');
              await insertOrUpdateFromServer(serverChange, SyncStatus.synced);
              localChangesMap.remove(localRecord.id);
            } else {
              print('    -> КОНФЛИКТ: Локальная версия связи ID \${localRecord.id} новее. Она будет отправлена на сервер.');
            }
          } else {
            await insertOrUpdateFromServer(serverChange, SyncStatus.synced);
            print('    -> ОБНОВЛЕНА с сервера: Связь ID \${serverChange.id}');
          }
        }
      }
    });
    return localChangesMap.values.toList();
  }
}
`;
    }
}