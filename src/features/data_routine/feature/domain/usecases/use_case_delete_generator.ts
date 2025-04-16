
import path from "path";
import { DefaultFileSystem } from "../../../../../core/implementations/default_file_system";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";


export class UseCaseDeleteGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);

    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, "delete.dart");
  }
  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;

    return `
import '../../repositories/${d}_repository.dart';

class Delete${D}UseCase {
  final I${D}Repository _repository;

  Delete${D}UseCase(this._repository);

  Future<void> call(int id) async {
    return _repository.delete${D}(id);
  }
}
`;
  }
}

