
import path from "path";
import { DefaultFileSystem } from "../../../../../core/implementations/default_file_system";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";


export class UseCaseCreateGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);

    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, "create.dart");
  }
  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;

    return `
import '../../repositories/${d}_repository.dart';
import '../../entities/${d}/${d}.dart';

class Create${D}UseCase {
  final ${D}Repository _repository;
  
  Create${D}UseCase(this._repository);
  
  Future<int> call(${D}Entity ${d}) {
    return _repository.create${D}(${d});
  }
}
  `;
  }
}

