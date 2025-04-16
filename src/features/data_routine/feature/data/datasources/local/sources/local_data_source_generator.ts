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
import '../tables/extensions/${d}_table_extension.dart';
import '../../../models/extensions/${d}_model_extension.dart';
import '../../../models/${d}/${d}_model.dart';
import '../dao/${d}/${d}_dao.dart';
import '../interfaces/${d}_local_datasource_service.dart';

class ${D}LocalDataSource implements I${D}LocalDataSource {
  final ${D}Dao ${d}Dao;

  ${D}LocalDataSource(this.${d}Dao);

  @override
  Future<List<${D}Model>> get${Ds}() async {
    final categories = await ${d}Dao.get${Ds}();
    return categories.toModels();
  }

  @override
  Future<${D}Model> get${D}ById(int id) async {
    final ${d} = await ${d}Dao.get${D}ById(id);
    return ${d}.toModel();
  }

  @override
  Future<int> create${D}(${D}Model ${d}) {
    return ${d}Dao.create${D}(${d}.toCompanion());
  }

  @override
  Future<void> update${D}(${D}Model ${d}) {
    return ${d}Dao.update${D}(${d}.toCompanionWithId());
  }

  @override
  Future<void> delete${D}(int id) async {
    await ${d}Dao.delete${D}(id);
  }
}

  `;
  }

}

