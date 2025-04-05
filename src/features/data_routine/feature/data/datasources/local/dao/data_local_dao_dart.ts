import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { pluralConvert } from "../../../../../../../utils/text_work/text_util";
import { BaseGenerator } from "../../../../../generators/base_generator";
import { DriftClassParser } from "../tables/drift_class_parser";


export class DataDaoGenerator extends BaseGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDaoPath(featurePath), `${entityName}_dao.dart`);
    }
    protected getContent(parser: DriftClassParser): string {
        const d = parser.driftClassNameLower;
        const D = parser.driftClassNameUpper;
        const Ds = pluralConvert(D);

        return `
import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/database.dart';
import '../tables/${d}_table.dart';

part '${d}_dao.g.dart';

@DriftAccessor(tables: [${D}Table])
class ${D}Dao extends DatabaseAccessor<AppDatabase> with _$${D}DaoMixin {
  ${D}Dao(super.db);

  Future<List<${D}TableData>> get${Ds}() => select(${d}Table).get();
  
  Future<${D}TableData> get${D}ById(int id) => 
      (select(${d}Table)..where((t) => t.id.equals(id)))
      .getSingle();
  
  Future<int> create${D}(${D}TableCompanion ${d}) =>
      into(${d}Table).insert(${d});
  
  Future<void> update${D}(${D}TableCompanion ${d}) =>
      update(${d}Table).replace(${d});
  
  Future<void> delete${D}(int id) =>
      (delete(${d}Table)..where((t) => t.id.equals(id))).go();
}

`;
    }

}

