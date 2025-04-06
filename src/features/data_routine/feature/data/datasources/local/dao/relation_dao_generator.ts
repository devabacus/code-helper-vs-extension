// src/features/data_routine/feature/data/datasources/local/dao/relation_dao_generator.ts

import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { RelationType, TableRelation } from "../../../../../interfaces/table_relation.interface";

export class RelationDaoGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDaoPath(featurePath), `${entityName}_dao.dart`);
  }

  protected getContent(data: { relation: TableRelation }): string {
    if (!data || !data.relation) {
      throw new Error("Данные о связи между таблицами не предоставлены");
    }

    const relation = data.relation;
    const { sourceTable, targetTable, relationType, intermediateTable, sourceField, targetField } = relation;
    
    // Преобразуем имена для использования в коде
    const sourceLower = this.toLowerCamelCase(sourceTable);
    const targetLower = this.toLowerCamelCase(targetTable);
    const sourceTableDart = `${sourceLower}Table`;
    const targetTableDart = `${targetLower}Table`;
    
    if (relationType === RelationType.MANY_TO_MANY && intermediateTable) {
      const intermediateLower = this.toLowerCamelCase(intermediateTable);
      const intermediateTableDart = `${intermediateLower}Table`;
      
      return this.generateManyToManyDao(
        sourceTable, targetTable, intermediateTable,
        sourceTableDart, targetTableDart, intermediateTableDart,
        sourceField, targetField
      );
    } else if (relationType === RelationType.ONE_TO_MANY) {
      return this.generateOneToManyDao(
        sourceTable, targetTable,
        sourceTableDart, targetTableDart,
        sourceField, targetField
      );
    }
    
    throw new Error(`Неподдерживаемый тип связи: ${relationType}`);
  }
  
  private toLowerCamelCase(s: string): string {
    return s.charAt(0).toLowerCase() + s.slice(1);
  }
  

// Добавляем вспомогательный метод для преобразования camelCase в snake_case
private toSnakeCase(s: string): string {
    return s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }

  private generateManyToManyDao(
    sourceTable: string, targetTable: string, intermediateTable: string,
    sourceTableDart: string, targetTableDart: string, intermediateTableDart: string,
    sourceField: string, targetField: string
  ): string {

    const sourceFile = this.toSnakeCase(sourceTable);
    const targetFile = this.toSnakeCase(targetTable);
    const intermediateFile = this.toSnakeCase(intermediateTable);    

    return `
import 'package:drift/drift.dart';
import '../../../../../../core/database/local/database.dart';
import '../tables/${targetFile}_table.dart';
import '../tables/${sourceFile}_table.dart';
import '../tables/${intermediateFile}_table.dart';

part '${intermediateFile}_dao.g.dart';

@DriftAccessor(tables: [${intermediateTable}Table, ${sourceTable}Table, ${targetTable}Table])
class ${intermediateTable}Dao extends DatabaseAccessor<AppDatabase> with _$${intermediateTable}DaoMixin {
  ${intermediateTable}Dao(super.db);

  Future<List<${targetTable}TableData>> get${targetTable}sFor${sourceTable}(int ${this.toLowerCamelCase(sourceTable)}Id) {
    return (select(${targetTableDart})
      ..where((t) => t.id.isInQuery(
          selectOnly(${intermediateTableDart})
            ..addColumns([${intermediateTableDart}.${targetField}])
            ..where(${intermediateTableDart}.${sourceField}.equals(${this.toLowerCamelCase(sourceTable)}Id)))))
        .get();
  }

  Future<List<${sourceTable}TableData>> get${sourceTable}sWith${targetTable}(int ${this.toLowerCamelCase(targetTable)}Id) {
    return (select(${sourceTableDart})
      ..where((t) => t.id.isInQuery(
          selectOnly(${intermediateTableDart})
            ..addColumns([${intermediateTableDart}.${sourceField}])
            ..where(${intermediateTableDart}.${targetField}.equals(${this.toLowerCamelCase(targetTable)}Id)))))
        .get();
  }

  Future<void> add${targetTable}To${sourceTable}(int ${this.toLowerCamelCase(sourceTable)}Id, int ${this.toLowerCamelCase(targetTable)}Id) {
    return into(${intermediateTableDart}).insert(
      ${intermediateTable}TableCompanion.insert(${sourceField}: ${this.toLowerCamelCase(sourceTable)}Id, ${targetField}: ${this.toLowerCamelCase(targetTable)}Id),
    );
  }

  Future<void> remove${targetTable}From${sourceTable}(int ${this.toLowerCamelCase(sourceTable)}Id, int ${this.toLowerCamelCase(targetTable)}Id) {
    return (delete(${intermediateTableDart})
      ..where((t) => t.${sourceField}.equals(${this.toLowerCamelCase(sourceTable)}Id) & t.${targetField}.equals(${this.toLowerCamelCase(targetTable)}Id)))
        .go();
  }

  Future<void> removeAll${targetTable}sFrom${sourceTable}(int ${this.toLowerCamelCase(sourceTable)}Id) {
    return (delete(${intermediateTableDart})..where((t) => t.${sourceField}.equals(${this.toLowerCamelCase(sourceTable)}Id))).go();
  }
}`;
  }
  
  private generateOneToManyDao(
    sourceTable: string, targetTable: string,
    sourceTableDart: string, targetTableDart: string,
    sourceField: string, targetField: string
  ): string {
    return `
import 'package:drift/drift.dart';
import '../../../../../../core/database/local/database.dart';
import '../tables/${this.toLowerCamelCase(sourceTable)}_table.dart';
import '../tables/${this.toLowerCamelCase(targetTable)}_table.dart';

part '${this.toLowerCamelCase(sourceTable)}_${this.toLowerCamelCase(targetTable)}_dao.g.dart';

@DriftAccessor(tables: [${sourceTable}Table, ${targetTable}Table])
class ${sourceTable}${targetTable}Dao extends DatabaseAccessor<AppDatabase> with _$${sourceTable}${targetTable}DaoMixin {
  ${sourceTable}${targetTable}Dao(super.db);

  Future<List<${sourceTable}TableData>> get${sourceTable}sFor${targetTable}(int ${this.toLowerCamelCase(targetTable)}Id) {
    return (select(${sourceTableDart})
      ..where((t) => t.${sourceField}.equals(${this.toLowerCamelCase(targetTable)}Id)))
        .get();
  }

  Future<${targetTable}TableData?> get${targetTable}For${sourceTable}(int ${this.toLowerCamelCase(sourceTable)}Id) {
    return (select(${targetTableDart})
      ..where((t) => t.id.equals(
          (selectOnly(${sourceTableDart})
            ..addColumns([${sourceTableDart}.${sourceField}])
            ..where(${sourceTableDart}.id.equals(${this.toLowerCamelCase(sourceTable)}Id)))
            .map((row) => row.read(${sourceTableDart}.${sourceField})!).getSingleOrNull()
      )))
      .getSingleOrNull();
  }

  Future<void> update${sourceTable}${targetTable}(int ${this.toLowerCamelCase(sourceTable)}Id, int ${this.toLowerCamelCase(targetTable)}Id) {
    return (update(${sourceTableDart})
      ..where((t) => t.id.equals(${this.toLowerCamelCase(sourceTable)}Id)))
      .write(${sourceTable}TableCompanion(${sourceField}: Value(${this.toLowerCamelCase(targetTable)}Id)));
  }
}`;
  }
}