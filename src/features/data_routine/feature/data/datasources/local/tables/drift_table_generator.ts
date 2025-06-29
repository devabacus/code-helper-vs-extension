import path from "path";

import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { ServerpodModel, ServerpodField } from "../../../../../serverpod_yaml_parser/formatters/types";
import { unCap, toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { CodeFormatter } from "../../../../../serverpod_yaml_parser/formatters/code_formatter";

export class DriftTableGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    const snakeCaseEntityName = toSnakeCase(entityName);
    return path.join(this.structure.getTablePath(featurePath), `${snakeCaseEntityName}_table.dart`);
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);

    const formatter = new CodeFormatter();

    // Проверяем, является ли это связанной таблицей (junction table)
    const isJunctionTable = this.isJunctionTable(model);

    if (isJunctionTable) {
      return this.generateJunctionTableContent(model, formatter);
    } else {
      return this.generateRegularTableContent(model, formatter);
    }
  }

  private isJunctionTable(model: ServerpodModel): boolean {
    // Junction table содержит только relation поля
    const relationFields = model.fields.filter(field => field.isRelation);
    const nonRelationFields = model.fields.filter(field => !field.isRelation);

    // Промежуточная таблица: содержит 2+ relation полей и никаких других полей
    return relationFields.length >= 2 && nonRelationFields.length === 0;
  }

  private generateJunctionTableContent(model: ServerpodModel, formatter: CodeFormatter): string {
    const D = model.className;
    const relationFields = model.fields.filter(field => field.isRelation);

    // Генерируем only foreign key поля
    const foreignKeyColumns = relationFields.map(field => {
      const foreignKeyFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
      const relatedTableName = field.relatedModel ? `${field.relatedModel}Table` : '';
      const references = relatedTableName ? `.references(${relatedTableName}, #id)` : '';

      return `  TextColumn get ${foreignKeyFieldName} => text()${references}();`;
    }).join('\n');

    // Составной primary key из всех foreign key полей
    const primaryKeyFields = relationFields.map(field => {
      const foreignKeyFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
      return foreignKeyFieldName;
    }).join(', ');

    // Генерируем импорты
    const relatedTableImports = this.generateRelatedTableImports(model.fields);

    return `
import 'package:drift/drift.dart';${relatedTableImports}

class ${D}Table extends Table {

${foreignKeyColumns}
  
  @override
  Set<Column> get primaryKey => {${primaryKeyFields}};
}

`;
  }

  private generateRegularTableContent(model: ServerpodModel, formatter: CodeFormatter): string {
    const D = model.className;

    // Генерируем колонки для полей модели
    const fieldColumns = formatter.generateDriftTableColumns(model.fields);
    const relatedTableImports = this.generateRelatedTableImports(model.fields);

    return `
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../../../../../../core/database/local/database_types.dart';${relatedTableImports}

class ${D}Table extends Table {

  // Статичные поля для всех моделей
  TextColumn get id => text().clientDefault(() => Uuid().v7())();
  IntColumn get userId => integer()();
  IntColumn get lastModified => integer().map(const MillisecondEpochConverter())();
  TextColumn get syncStatus => text().map(const SyncStatusConverter())();
  
  // Поля модели
${fieldColumns}
  
  @override
  Set<Column> get primaryKey => {id};
}

`;
  }

  private generateRelatedTableImports(fields: ServerpodField[]): string {
    const relationFields = fields.filter(field =>
      field.isRelation &&
      field.relationType === 'manyToOne' && // Только manyToOne связи
      field.relatedModel
    );

    if (relationFields.length === 0) {
      return '';
    }

    const imports = relationFields.map(field => {
      const relatedModelName = field.relatedModel!;
      const tableFileName = `${relatedModelName.toLowerCase()}_table.dart`;
      return `import '${tableFileName}';`;
    });

    // Убираем дубликаты и добавляем перенос строки в начале
    const uniqueImports = [...new Set(imports)];
    return '\n' + uniqueImports.join('\n');
  }
}