
import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { pluralConvert } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";

export class DomainRepositoryGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();

  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainRepositoryPath(featurePath), `${entityName}_repository.dart`);
  }

  protected getContent(parser: DriftClassParser): string {

    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const Ds = pluralConvert(D);

    return `import '../entities/${d}/${d}.dart';

abstract class I${D}Repository {
  Future<List<${D}Entity>> get${Ds}();
  Stream<List<${D}Entity>> watch${Ds}();
  Future<${D}Entity> get${D}ById(String id);
  Future<String> create${D}(${D}Entity ${d});
  Future<bool> update${D}(${D}Entity ${d});
  Future<bool> delete${D}(String id);
}
`;
  }
}

