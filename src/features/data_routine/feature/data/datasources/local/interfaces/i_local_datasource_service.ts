import path from "path";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { DriftClassParser } from "../tables/drift_class_parser";
import { pluralConvert } from "../../../../../../../utils/text_work/text_util";

export class LocalDataSourceServiceGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();

  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataLocalInterfacesPath(featurePath), `${entityName}_local_datasource_service.dart`);
  }

  protected getContent(parser: DriftClassParser): string {

    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const Ds = pluralConvert(D);

    return `
import '../../../models/${d}/${d}_model.dart';

abstract class I${D}LocalDataSource {
  Future<List<${D}Model>> get${Ds}();
  Stream<List<${D}Model>> watch${Ds}();
  Future<${D}Model> get${D}ById(String id);
  Future<String> create${D}(${D}Model ${d});
  Future<bool> update${D}(${D}Model ${d});
  Future<bool> delete${D}(String id);
}

`;
  }
}

