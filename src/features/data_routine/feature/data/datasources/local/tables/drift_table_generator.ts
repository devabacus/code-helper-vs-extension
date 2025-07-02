import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

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
        
        const d1 = model.fields[1].name.replace('Id', '');
        const d2 = model.fields[2].name.replace('Id', '');;

        const D1 = cap(d1);
        const D2 = cap(d2);

        const tableName = model.className;

        
        return `
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../../../../../../core/database/local/database_types.dart';

class TagTable extends Table {

  // Статичные поля для всех моделей
  TextColumn get id => text().clientDefault(() => Uuid().v7())();
  IntColumn get userId => integer()();
  IntColumn get lastModified => integer().map(const MillisecondEpochConverter())();
  TextColumn get syncStatus => text().map(const SyncStatusConverter())();
  
  // Поля модели
  TextColumn get title => text()();
  
  @override
  Set<Column> get primaryKey => {id};
}
`;
    } 

}