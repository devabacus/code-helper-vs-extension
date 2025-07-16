import path from "path";
import { DefaultProjectStructureLegacy } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

export class DriftRelateTableGenerator extends DataRoutineGenerator {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getTablePath(featurePath), `${entityName}_table.dart`);
  }

  protected getContent(model: ServerpodModel): string {

    // const d1 = model.fields[1].name.replace('Id', '');
    const d1 = model.fields[1].relatedModel!;
    const d2 = model.fields[2].relatedModel!;

    const D1 = cap(d1);
    const D2 = cap(d2);

    const tableName = model.className;

    return `
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../../../../../../core/database/local/database_types.dart';
import '${d1}_table.dart';
import '${d2}_table.dart';

class ${tableName}Table extends Table {

  TextColumn get id => text().clientDefault(() => Uuid().v7())();
  IntColumn get userId => integer()();
  TextColumn get customerId => text()();
  DateTimeColumn get createdAt => dateTime().clientDefault(() => DateTime.now().toUtc())();
  IntColumn get lastModified => integer().map(const MillisecondEpochConverter())();
  TextColumn get syncStatus => text().map(const SyncStatusConverter())();
  BoolColumn get isDeleted => boolean().withDefault(const Constant(false))();

  TextColumn get ${d1}Id => text().references(${D1}Table, #id)();
  TextColumn get ${d2}Id => text().references(${D2}Table, #id)();
  
  @override
  List<String> get customConstraints => [
    'UNIQUE(${d1}_id, ${d2}_id, user_id, customer_id)',
  ];
  
  @override
  Set<Column> get primaryKey => {id};
}
`;
  }

}