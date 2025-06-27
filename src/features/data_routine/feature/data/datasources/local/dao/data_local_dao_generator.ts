// G:/Projects/vs_code_extensions/snippet/code-helper/src/features/data_routine/feature/data/datasources/local/dao/data_local_dao_generator.ts
import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure"; //
import { pluralConvert, unCap, cap } from "../../../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator"; //
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/types";

export class DataDaoGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDaoPath(featurePath), entityName, `${entityName}_dao.dart`); //
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

    return `
import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/interface/i_database_service.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../../../../../../core/database/local/database_types.dart';
import '../../tables/${d}_table.dart';

part '${d}_dao.g.dart';

@DriftAccessor(tables: [${D}Table])
class ${D}Dao extends DatabaseAccessor<AppDatabase>
    with _$${D}DaoMixin {
  ${D}Dao(IDatabaseService databaseService)
    : super(databaseService.database);

  AppDatabase get db => attachedDatabase;

  Future<List<${D}TableData>> get${Ds}({int? userId}) =>
    (select(${d}Table)
      ..where((t) => t.syncStatus.equals(SyncStatus.deleted.name).not())
      ..where((t) => userId != null ? t.userId.equals(userId) : const Constant(true)))
    .get();     

  Stream<List<${D}TableData>> watch${Ds}({int? userId}) =>
    (select(${d}Table)
      ..where((t) => t.syncStatus.equals(SyncStatus.deleted.name).not())
      ..where((t) => userId != null ? t.userId.equals(userId) : const Constant(true)))
    .watch();

  Future<${D}TableData> get${D}ById(String id, {required int userId}) =>
      (select(${d}Table)
        ..where((t) => t.id.equals(id) & t.userId.equals(userId)))
      .getSingle();

  Future<String> create${D}(${D}TableCompanion companion) async {
    final id = companion.id.value;
    try {
      final existing${D} =
          await (select(${d}Table)
            ..where((t) => t.id.equals(id))).getSingleOrNull();

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

Future<bool> update${D}(${D}TableCompanion companion, {required int userId}) async {    
    final idToUpdate = companion.id.value;
    final updatedRows = await (update(${d}Table)
      ..where((t) => t.id.equals(idToUpdate) & t.userId.equals(userId))) 
      .write(companion); 
    return updatedRows > 0;
}

  Future<bool> softDelete${D}(String id, {required int userId}) async {
    
    final companion = ${D}TableCompanion(
      syncStatus: Value(SyncStatus.deleted),
      lastModified: Value(DateTime.now()), 
    );
    
    final updatedRows = await (update(${d}Table)
      ..where((t) => t.id.equals(id) & t.userId.equals(userId)))
      .write(companion);
    
    return updatedRows > 0;
  }

  Future<int> physicallyDelete${D}(String id, {required int userId}) async {
    return (delete(${d}Table)
      ..where((t) => t.id.equals(id) & t.userId.equals(userId)))
      .go();
  }

  Future<bool> ${d}Exists(String id) async {
    if (id.isEmpty) return false;

    final ${d} =
        await (select(${d}Table)
          ..where((t) => t.id.equals(id))).getSingleOrNull();

    return ${d} != null;
  }

  Future<int> get${Ds}Count({int? userId}) async {
    final countQuery = selectOnly(${d}Table)
      ..addColumns([${d}Table.id.count()])
      ..where(userId != null ? ${d}Table.userId.equals(userId) : const Constant(true));

    final result = await countQuery.getSingle();
    return result.read(${d}Table.id.count()) ?? 0;
  }

  Future<void> insert${Ds}(List<${D}TableCompanion> companions) async {
    await batch((batch) {
      batch.insertAll(${d}Table, companions);
    });
  }

  Future<int> deleteAll${Ds}({int? userId}) {
    if (userId != null) {
      return (delete(${d}Table)..where((t) => t.userId.equals(userId))).go();
    } else {
      return delete(${d}Table).go();
    }
  }
  ${foreignKeyMethods}
}
`;
  }
}