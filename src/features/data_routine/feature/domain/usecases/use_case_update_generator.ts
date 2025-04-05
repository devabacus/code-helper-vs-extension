
import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";


export class UseCaseUpdateGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);

    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, "update.dart");
  }
  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;

    return `
import '../../entities/${d}/${d}.dart';
import '../../repositories/${d}_repository.dart';

class Update${D}UseCase {
  final ${D}Repository _repository;

  Update${D}UseCase(this._repository);

  Future<void> call(${D}Entity ${d}) async {
    return _repository.update${D}(${d});
  }
}
`;
  }
}

