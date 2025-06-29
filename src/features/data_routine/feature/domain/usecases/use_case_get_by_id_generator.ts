
import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";


export class UseCaseGetByIdGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);

    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, "get_by_id.dart");
  }
  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);

    return `
import '../../repositories/${d}_repository.dart';
import '../../entities/${d}/${d}.dart';

class Get${D}ByIdUseCase {
  final I${D}Repository _repository;

  Get${D}ByIdUseCase(this._repository);

  Future<${D}Entity?> call(String id) {
    return _repository.get${D}ById(id);
  }
}
`;
  }
}

