import path from "path";
import { DefaultProjectStructureLegacy } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, cap, unCap, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class UseCaseRelateGenerator extends DataRoutineGenerator {
  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath), `${entityName}_usecases.dart`);
  }

  protected getContent(model: ServerpodModel): string {
    const d1 = model.fields[1].relatedModel!;
    const d2 = model.fields[2].relatedModel!;

    const D1 = cap(d1);
    const D1s = pluralConvert(D1);
    const D2 = cap(d2);
    const D2s = pluralConvert(D2);
    const ClassName = `${model.className}`;
    const ClassNameS = pluralConvert(ClassName);
    const tableName = `${model.tableName}`;

    return `import '../repositories/${tableName}_repository.dart';
import '../entities/${d1}/${d1}_entity.dart';
import '../entities/${d2}/${d2}_entity.dart';

class Add${D2}To${D1}UseCase {
  final I${ClassName}Repository _repository;
  Add${D2}To${D1}UseCase(this._repository);

  Future<void> call({required String ${d1}Id, required String ${d2}Id}) {
    return _repository.add${D2}To${D1}(${d1}Id: ${d1}Id, ${d2}Id: ${d2}Id);
  }
}

class Remove${D2}From${D1}UseCase {
  final I${ClassName}Repository _repository;
  Remove${D2}From${D1}UseCase(this._repository);

  Future<void> call({required String ${d1}Id, required String ${d2}Id}) {
    return _repository.remove${D2}From${D1}(${d1}Id: ${d1}Id, ${d2}Id: ${d2}Id);
  }
}

class RemoveAll${D2s}From${D1}UseCase {
  final I${ClassName}Repository _repository;
  RemoveAll${D2s}From${D1}UseCase(this._repository);

  Future<void> call(String ${d1}Id) {
    return _repository.removeAll${D2s}From${D1}(${d1}Id);
  }
}

class Get${D2s}For${D1}UseCase {
  final I${ClassName}Repository _repository;
  Get${D2s}For${D1}UseCase(this._repository);

  Future<List<${D2}Entity>> call(String ${d1}Id) {
    return _repository.get${D2s}For${D1}(${d1}Id);
  }
}

class Get${D1s}For${D2}UseCase {
  final I${ClassName}Repository _repository;
  Get${D1s}For${D2}UseCase(this._repository);

  Future<List<${D1}Entity>> call(String ${d2}Id) {
    return _repository.get${D1s}For${D2}(${d2}Id);
  }
}
`;
  }
}