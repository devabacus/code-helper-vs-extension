
import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";


export class UseCaseWatchAllGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);

    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, "watch_all.dart");
  }
  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    return `
import 'dart:async';
import '../../repositories/${d}_repository.dart';
import '../../entities/${d}/${d}.dart';

class Watch${Ds}UseCase {
  final I${D}Repository _repository;

  Watch${Ds}UseCase(this._repository);

  Stream<List<${D}Entity>> call() {
    return _repository.watch${Ds}();
  }
}
`;
  }
}

