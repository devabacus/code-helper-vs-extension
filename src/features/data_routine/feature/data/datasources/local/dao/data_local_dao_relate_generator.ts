import path from "path";
import { DefaultProjectStructureLegacy } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

export class DataDaoRelateGenerator extends DataRoutineGenerator {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
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

    return `import 'package:drift/drift.dart';

import '../../../../../../../core/database/local/database.dart';
import '../../../../../../../core/database/local/interface/i_database_service.dart';
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
    await into(
      ${className}Table,
    ).insert(companion, mode: InsertMode.insertOrReplace);
    return id;
  }

  /// Обновляет существующую связь (например, для изменения syncStatus).
  Future<bool> update${ClassName}(
    ${ClassName}TableCompanion companion, {
    required int userId,
    required String customerId,
  }) async {
    final idToUpdate = companion.id.value;
    final updatedRows = await (update(${className}Table)..where(
      (t) =>
          t.id.equals(idToUpdate) &
          t.userId.equals(userId) &
          t.customerId.equals(customerId),
    )).write(companion);
    return updatedRows > 0;
  }

  Future<int> updateRelationsBy${D1}Id(
    String ${d1}Id,
    ${ClassName}TableCompanion companion, {
    required int userId,
    required String customerId,
  }) async {
    final updatedRows = await (update(${className}Table)..where(
      (t) =>
          t.${d1}Id.equals(${d1}Id) &
          t.userId.equals(userId) &
          t.customerId.equals(customerId),
    )).write(companion);

    print('DAO: Массово обновлено $updatedRows связей для задачи $${d1}Id');
    return updatedRows;
  }

  /// Физически удаляет связь из базы данных. Используется после синхронизации.
  Future<int> physicallyDelete${ClassName}(
    String id, {
    required int userId,
    required String customerId,
  }) async {
    return (delete(${className}Table)..where(
      (t) =>
          t.id.equals(id) &
          t.userId.equals(userId) &
          t.customerId.equals(customerId),
    )).go();
  }

  /// Получает одну конкретную связь по ее уникальному ID.
  Future<${ClassName}TableData?> getRelationById(
    String id, {
    required int userId,
    required String customerId,
  }) {
    return (select(${className}Table)..where(
      (t) =>
          t.id.equals(id) &
          t.userId.equals(userId) &
          t.customerId.equals(customerId),
    )).getSingleOrNull();
  }

  /// Получает связь по ${d1}Id и ${d2}Id.
  Future<${ClassName}TableData?> getRelationBy${D1}And${D2}(
    String ${d1}Id,
    String ${d2}Id, {
    required int userId,
    required String customerId,
  }) {
    return (select(${className}Table)..where(
      (t) =>
          t.${d1}Id.equals(${d1}Id) &
          t.${d2}Id.equals(${d2}Id) &
          t.userId.equals(userId) &
          t.customerId.equals(customerId),
    )).getSingleOrNull();
  }

  /// Отслеживает все активные (не удаленные) связи для указанного пользователя.
  Stream<List<${ClassName}TableData>> watchAllRelations({
    required int userId,
    required String customerId,
  }) {
    return (select(${className}Table)..where(
      (t) =>
          t.userId.equals(userId) &
          t.customerId.equals(customerId) &
          t.isDeleted.equals(false),
    )).watch();
  }
}
`;
  }
}