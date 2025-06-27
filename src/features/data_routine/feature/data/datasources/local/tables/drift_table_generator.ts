import path from "path";

import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/types";
import { unCap } from "../../../../../../../utils/text_work/text_util";
import { CodeFormatter } from "../../../../../formatters/code_formatter";

export class DriftTableGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getTablePath(featurePath), `${entityName}_table.dart`);
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);

    const formatter = new CodeFormatter();
    // Генерируем колонки для полей модели
    const fieldColumns = formatter.generateDriftTableColumns(model.fields);

    return `
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../../../../../../core/database/local/database_types.dart';

class ${D}Table extends Table {

  TextColumn get id => text().clientDefault(() => Uuid().v7())();
  IntColumn get userId => integer()();
  IntColumn get lastModified => integer().map(const MillisecondEpochConverter())();
  TextColumn get syncStatus => text().map(const SyncStatusConverter())();

  ${fieldColumns}
  
  @override
  Set<Column> get primaryKey => {id};
}

`;
  }
}