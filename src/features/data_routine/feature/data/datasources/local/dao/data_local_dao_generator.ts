import path from "path";
import { DefaultProjectStructureLegacy } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../../../core/interfaces/project_structure";
import { pluralConvert, unCap, cap, toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";
import { RelationAnalyzer } from "../../../../../serverpod_yaml_parser/relation-analyzer";

export class DataDaoGenerator extends DataRoutineGenerator {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    const snakeCaseEntityName = toSnakeCase(entityName);
    return path.join(this.structure.getDaoPath(featurePath), snakeCaseEntityName, `${snakeCaseEntityName}_dao.dart`);
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    // Генерация методов для получения по внешнему ключу
    let foreignKeyMethods = '';
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);

    if (relationFields.length > 0) {
      foreignKeyMethods = relationFields.map(field => {
        const fieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const daoMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fieldName;
        const parameterType = 'String';

        return `
  Future<List<${D}TableData>> ${daoMethodName}(${parameterType} ${parameterName}, {required int userId, required String customerId}) =>
    (select(${d}Table)
      ..where((t) => t.${parameterName}.equals(${parameterName}) & t.userId.equals(userId) & t.customerId.equals(customerId) & t.isDeleted.equals(false)))
    .get();`;
      }).join('\n');
    }

    return `import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../../../../../../core/database/local/interface/i_database_service.dart';
import '../../tables/${d}_table.dart';

part '${d}_dao.g.dart';

@DriftAccessor(tables: [${D}Table])
class ${D}Dao extends DatabaseAccessor<AppDatabase>
    with _$${D}DaoMixin {
  ${D}Dao(IDatabaseService databaseService)
    : super(databaseService.database);

  AppDatabase get db => attachedDatabase;

  Future<List<${D}TableData>> get${Ds}({
    required int userId,
    required String customerId,
  }) =>
      (select(${d}Table)
            ..where((t) => t.isDeleted.equals(false))
            ..where(
              (t) => t.userId.equals(userId) & t.customerId.equals(customerId),
            ))
          .get();

  Stream<List<${D}TableData>> watch${Ds}({
    required int userId,
    required String customerId,
  }) =>
      (select(${d}Table)
            ..where((t) => t.isDeleted.equals(false))
            ..where(
              (t) => t.userId.equals(userId) & t.customerId.equals(customerId),
            ))
          .watch();

  Future<${D}TableData?> get${D}ById(
    String id, {
    required int userId,
    required String customerId,
  }) =>
      (select(${d}Table)..where(
        (t) =>
            t.id.equals(id) &
            t.userId.equals(userId) &
            t.customerId.equals(customerId),
      )).getSingleOrNull();

  Future<List<${D}TableData>> get${Ds}ByIds(
    List<String> ids, {
    required int userId,
    required String customerId,
  }) {
    if (ids.isEmpty) {
      return Future.value([]);
    }
    return (select(${d}Table)..where(
      (t) =>
          t.id.isIn(ids) &
          t.userId.equals(userId) &
          t.customerId.equals(customerId) &
          t.isDeleted.equals(false),
    )).get();
  }

  Future<String> create${D}(${D}TableCompanion companion) async {
    final id = companion.id.value;
    try {
      final existing${D} =
          await (select(${d}Table)..where(
            (t) =>
                t.id.equals(id) &
                t.userId.equals(companion.userId.value) &
                t.customerId.equals(companion.customerId.value),
          )).getSingleOrNull();

      if (existing${D} != null) {
        throw StateError('${d} with ID $id exists');
      }

      await into(${d}Table).insert(companion);
      return id;
    } catch (e) {
      print('fail of creating ${d}: $e');
      rethrow;
    }
  }

  Future<bool> update${D}ById(
    String id,
    ${D}TableCompanion companion, {
    required int userId,
    required String customerId,
  }) async {
    // final idToUpdate = companion.id.value;
    final updatedRows = await (update(${d}Table)..where(
      (t) =>
          t.id.equals(id) &
          t.userId.equals(userId) &
          t.customerId.equals(customerId),
    )).write(companion);
    return updatedRows > 0;
  }

  Future<int> physicallyDelete${D}(
    String id, {
    required int userId,
    required String customerId,
  }) async {
    return (delete(${d}Table)..where(
      (t) =>
          t.id.equals(id) &
          t.userId.equals(userId) &
          t.customerId.equals(customerId),
    )).go();
  }

  Future<bool> ${d}Exists(
    String id, {
    required int userId,
    required String customerId,
  }) async {
    if (id.isEmpty) return false;

    final ${d} =
        await (select(${d}Table)..where(
          (t) =>
              t.id.equals(id) &
              t.userId.equals(userId) &
              t.customerId.equals(customerId),
        )).getSingleOrNull();

    return ${d} != null;
  }

  Future<int> get${Ds}Count({
    required int userId,
    required String customerId,
  }) async {
    final countQuery =
        selectOnly(${d}Table)
          ..addColumns([${d}Table.id.count()])
          ..where(
            ${d}Table.userId.equals(userId) &
                ${d}Table.customerId.equals(customerId),
          );

    final result = await countQuery.getSingle();
    return result.read(${d}Table.id.count()) ?? 0;
  }

  Future<void> insert${Ds}(List<${D}TableCompanion> companions) async {
    await batch((batch) {
      batch.insertAll(${d}Table, companions);
    });
  }

  Future<int> deleteAll${Ds}({
    required int userId,
    required String customerId,
  }) {
    return (delete(${d}Table)..where(
      (t) => t.userId.equals(userId) & t.customerId.equals(customerId),
    )).go();
  }
  ${foreignKeyMethods}
}
`;
  }
}