
import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";


export class UseCaseGetByIdGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);

    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, "get_by_id.dart");
  }
  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;

    return `
import '../../repositories/${d}_repository.dart';
import '../../entities/${d}/${d}.dart';

class Get${D}ByIdUseCase {
  final ${D}Repository _repository;

  Get${D}ByIdUseCase(this._repository);

  Future<${D}Entity?> call(int id) {
    return _repository.get${D}ById(id);
  }
}
`;
  }
}

