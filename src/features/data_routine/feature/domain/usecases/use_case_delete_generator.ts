
import path from "path";
import { DefaultFileSystem } from "../../../../../core/implementations/default_file_system";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";
import { unCap } from "../../../../../utils/text_work/text_util";


export class UseCaseDeleteGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);

    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, "delete.dart");
  }
  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);

    return `
import '../../repositories/${d}_repository.dart';

class Delete${D}UseCase {
  final I${D}Repository _repository;

  Delete${D}UseCase(this._repository);

  Future<bool> call(String id) async {
    return _repository.delete${D}(id);
  }
}
`;
  }
}

