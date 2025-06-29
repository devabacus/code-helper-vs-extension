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
        const snakeCaseEntityName = toSnakeCase(entityName);
        return path.join(this.structure.getDaoPath(featurePath), entityName, `${snakeCaseEntityName}_dao.dart`);
    }

    protected getContent(model: ServerpodModel): string {
        
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        const D1 = cap(sourceField.name); // Task
        const D2 = cap(targetField.name); // Tag
        const d1 = unCap(D1); // task
        const d2 = unCap(D2); // tag
        
        const RelTable = `${model.className}Table`; // TaskTagMapTable
        const relTable = `${unCap(model.className)}Table`; // taskTagMapTable
        const Dao = `${model.className}Dao`; // TaskTagMapDao
        const TableData = `${RelTable}Data`; // TaskTagMapTableData
        const TableCompanion = `${RelTable}Companion`; // TaskTagMapTableCompanion
        
        // --- ИСПРАВЛЕНИЕ: Используем String вместо UuidValue ---
        const idType = 'String'; 

        return `
import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/interface/i_database_service.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../tables/${toSnakeCase(model.className)}_table.dart';

part '${toSnakeCase(model.className)}_dao.g.dart';

@DriftAccessor(tables: [${RelTable}])
class ${Dao} extends DatabaseAccessor<AppDatabase>
    with _$${Dao}Mixin {
  ${Dao}(IDatabaseService databaseService)
      : super(databaseService.database);

  AppDatabase get db => attachedDatabase;

  /// Creates a connection between a ${D1} and a ${D2}.
  Future<void> addRelation({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  }) async {
    final existing = await (select(${relTable})
          ..where((t) => t.${d1}Id.equals(${d1}Id))
          ..where((t) => t.${d2}Id.equals(${d2}Id)))
        .getSingleOrNull();

    if (existing == null) {
      final companion = ${TableCompanion}.insert(
          ${d1}Id: ${d1}Id,
          ${d2}Id: ${d2}Id,
      );
      await into(${relTable}).insert(companion);
    }
  }

  /// Removes a connection between a ${D1} and a ${D2}.
  Future<int> removeRelation({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  }) {
    return (delete(${relTable})
          ..where((t) => t.${d1}Id.equals(${d1}Id))
          ..where((t) => t.${d2}Id.equals(${d2}Id)))
        .go();
  }

  /// Gets all relations for a specific ${D1}.
  Future<List<${TableData}>> getRelationsFor${D1}(${idType} ${d1}Id) {
    return (select(${relTable})..where((t) => t.${d1}Id.equals(${d1}Id))).get();
  }

  /// Gets all relations for a specific ${D2}.
  Future<List<${TableData}>> getRelationsFor${D2}(${idType} ${d2}Id) {
    return (select(${relTable})..where((t) => t.${d2}Id.equals(${d2}Id))).get();
  }

  /// Removes all connections for a specific ${D1}.
  Future<int> removeAllFor${D1}(${idType} ${d1}Id) {
    return (delete(${relTable})..where((t) => t.${d1}Id.equals(${d1}Id))).go();
  }

  /// Removes all connections for a specific ${D2}.
  Future<int> removeAllFor${D2}(${idType} ${d2}Id) {
    return (delete(${relTable})..where((t) => t.${d2}Id.equals(${d2}Id))).go();
  }
}
`;
    }
}