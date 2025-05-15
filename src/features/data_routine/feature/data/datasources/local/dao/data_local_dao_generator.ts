import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { pluralConvert } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { DriftClassParser } from "../tables/drift_class_parser";


export class DataDaoGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDaoPath(featurePath), entityName, `${entityName}_dao.dart`);
    }
    protected getContent(parser: DriftClassParser): string {
        const d = parser.driftClassNameLower;
        const D = parser.driftClassNameUpper;
        const Ds = pluralConvert(D);

        return `import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart';

import '../../../../../../../core/database/local/interface/i_database_service.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../tables/${d}_table.dart';

part '${d}_dao.g.dart';

@DriftAccessor(tables: [${D}Table])
class ${D}Dao extends DatabaseAccessor<AppDatabase>
    with _$${D}DaoMixin {
  final Uuid _uuid = Uuid();

  ${D}Dao(IDatabaseService databaseService)
    : super(databaseService.database);

  Future<List<${D}TableData>> get${Ds}() =>
      select(${d}Table).get();

  Stream<List<${D}TableData>> watch${Ds}() =>
      select(${d}Table).watch();

  Future<${D}TableData> get${D}ById(String id) =>
      (select(${d}Table)..where((t) => t.id.equals(id))).getSingle();

  Future<String> create${D}(${D}TableCompanion companion) async {
    String idToInsert;
    ${D}TableCompanion companionForInsert;

    if (companion.id.present && companion.id.value.isNotEmpty) {
      idToInsert = companion.id.value;
      companionForInsert = companion;
    } else {
      idToInsert = _uuid.v7();
      companionForInsert = companion.copyWith(id: Value(idToInsert));
    }

    await into(${d}Table).insert(companionForInsert);
    return idToInsert;
  }

  Future<void> update${D}(${D}TableCompanion ${d}) =>
      update(${d}Table).replace(${d});

  Future<void> delete${D}(String id) =>
      (delete(${d}Table)..where((t) => t.id.equals(id))).go();
}

`;
    }

}

