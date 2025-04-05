import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { pluralConvert } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { DriftClassParser } from "../tables/drift_class_parser";


export class DataSourcesGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;


  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getLocalDataSourcePath(featurePath), `${entityName}_local_data_source.dart`);
  }
  protected getContent(parser: DriftClassParser): string {
    const D = parser.driftClassNameUpper;
    const d = parser.driftClassNameLower;
    const Ds = pluralConvert(D);

    return `
import '../../../models/extensions/${d}/${d}_model_extension.dart';
import '../../../models/extensions/${d}/${d}_table_extension.dart';
import '../../../../../../core/database/local/database.dart';
import '../../../../data/models/${d}/${d}_model.dart';
import '../../local/dao/${d}/${d}_dao.dart';

class ${D}LocalDataSource {
  final ${D}Dao _${d}Dao;

  ${D}LocalDataSource(AppDatabase db) : _${d}Dao = ${D}Dao(db);

    Future<List<${D}Model>> get${Ds}() async {
    final categories = await _${d}Dao.get${Ds}();
    return categories.toModels();
  }

  Future<${D}Model> get${D}ById(int id) async {
    final ${d} = await _${d}Dao.get${D}ById(id);
    return ${d}.toModel();
  }

  Future<int> create${D}(${D}Model ${d}) {
    return _${d}Dao.create${D}(${d}.toCompanion());
  }

  Future<void> update${D}(${D}Model ${d}) {
    return _${d}Dao.update${D}(${d}.toCompanionWithId());
  }

  Future<void> delete${D}(int id) async {
      await _${d}Dao.delete${D}(id);
    }
}

  `;
  }

}

