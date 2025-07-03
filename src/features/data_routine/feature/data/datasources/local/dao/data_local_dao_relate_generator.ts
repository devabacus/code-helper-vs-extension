import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

export class DataDaoRelateGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDaoPath(featurePath), entityName, `${entityName}_dao.dart`);
    }

    protected getContent(model: ServerpodModel): string {
        
        const d1 = model.fields[1].relatedModel!;
        const d2 = model.fields[2].relatedModel!;       

        const D1 = cap(d1);
        const D2 = cap(d2);
        const ClassName = `${model.className}`; 
        const className = `${unCap(ClassName)}`;
        const tableName = `${model.tableName}`;

        return `
import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/interface/i_database_service.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../../../../../../core/database/local/database_types.dart';
import '../../tables/${tableName}_table.dart';

part '${tableName}_dao.g.dart';

@DriftAccessor(tables: [${ClassName}Table])
class ${ClassName}Dao extends DatabaseAccessor<AppDatabase>
    with _$${ClassName}DaoMixin {
  ${ClassName}Dao(IDatabaseService databaseService)
      : super(databaseService.database);

  AppDatabase get db => attachedDatabase;

  /// Создает новую связь ${D1}-${D2}.
  /// Вставляет или заменяет запись, если она уже существует.
  Future<String> create${ClassName}(${ClassName}TableCompanion companion) async {
    final id = companion.id.value;
    await into(${className}Table).insert(companion, mode: InsertMode.insertOrReplace);
    return id;
  }

  /// Обновляет существующую связь (например, для изменения syncStatus).
  Future<bool> update${ClassName}(${ClassName}TableCompanion companion, {required int userId}) async {
    final idToUpdate = companion.id.value;
    final updatedRows = await (update(${className}Table)
          ..where((t) => t.id.equals(idToUpdate) & t.userId.equals(userId)))
        .write(companion);
    return updatedRows > 0;
  }

  /// "Мягко" удаляет связь по ее ID, помечая ее как удаленную.
  Future<bool> softDelete${ClassName}ById(String id, {required int userId}) async {
    final companion = ${ClassName}TableCompanion(
      syncStatus: Value(SyncStatus.deleted),
      lastModified: Value(DateTime.now().toUtc()),
    );
    final updatedRows = await (update(${className}Table)
          ..where((t) => t.id.equals(id) & t.userId.equals(userId)))
        .write(companion);
    return updatedRows > 0;
  }

    Future<int> softDeleteRelationsBy${D1}Id(String ${d1}Id, {required int userId}) async {
    final companion = ${ClassName}TableCompanion(
      syncStatus: Value(SyncStatus.deleted),
      lastModified: Value(DateTime.now().toUtc()),
    );
    // Обновляем все записи, где ${d1}Id и userId совпадают
    final updatedRows = await (update(${className}Table)
          ..where((t) => t.${d1}Id.equals(${d1}Id) & t.userId.equals(userId)))
        .write(companion);
    
    print('DAO: Мягко удалено $updatedRows связей для задачи $${d1}Id');
    return updatedRows;
  }
  
  /// Физически удаляет связь из базы данных. Используется после синхронизации.
  Future<int> physicallyDelete${ClassName}(String id, {required int userId}) async {
    return (delete(${className}Table)
          ..where((t) => t.id.equals(id) & t.userId.equals(userId)))
        .go();
  }

  /// Получает одну конкретную связь по ее уникальному ID.
  Future<${ClassName}TableData?> getRelationById(String id, {required int userId}) {
    return (select(${className}Table)
        ..where((t) => t.id.equals(id) & t.userId.equals(userId)))
        .getSingleOrNull();
  }

/// Получает связь по ${d1}Id и ${d2}Id.
Future<${ClassName}TableData?> getRelationBy${D1}And${D2}(String ${d1}Id, String ${d2}Id, {required int userId}) {
  return (select(${className}Table)
        ..where((t) => t.${d1}Id.equals(${d1}Id) & 
                       t.${d2}Id.equals(${d2}Id) & 
                       t.userId.equals(userId)))
      .getSingleOrNull();
}

  /// Отслеживает все активные (не удаленные) связи для указанного пользователя.
  Stream<List<${ClassName}TableData>> watchAllRelations({required int userId}) {
    return (select(${className}Table)
          ..where((t) => t.userId.equals(userId) & t.syncStatus.equals(SyncStatus.deleted.name).not()))
        .watch();
  }
}
`;
    }
}