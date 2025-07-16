import path from "path";
import { DefaultProjectStructureLegacy } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { CodeFormatter } from "../../../../../serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodField, ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

export class DriftTableGenerator extends DataRoutineGenerator {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getTablePath(featurePath), `${entityName}_table.dart`);
  }

  protected getContent(model: ServerpodModel): string {

    const formatter = new CodeFormatter();
    const fieldColumns = formatter.generateDriftTableColumns(model.fields);
    const relatedTableImports = this.generateRelatedTableImports(model.fields);
    const D = model.className;


    return `
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../../../../../../core/database/local/database_types.dart';${relatedTableImports}

class ${D}Table extends Table {

  ${fieldColumns}
  
  TextColumn get id => text().clientDefault(() => Uuid().v7())();
  IntColumn get userId => integer()();
  TextColumn get customerId => text()();
  DateTimeColumn get createdAt => dateTime().clientDefault(() => DateTime.now().toUtc())();
  IntColumn get lastModified => integer().map(const MillisecondEpochConverter())();
  TextColumn get syncStatus => text().map(const SyncStatusConverter())();
  BoolColumn get isDeleted => boolean().withDefault(const Constant(false))();
    
  @override
  Set<Column> get primaryKey => {id};
}
`;
  }


  private generateRelatedTableImports(fields: ServerpodField[]): string {
    const relationFields = fields.filter(field =>
      field.isRelation &&
      field.relationType === 'manyToOne' && // Только manyToOne связи
      field.relatedModel && field.name !== 'customerId'//TODO по хорошему нужно найти где это фильтронуть
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
