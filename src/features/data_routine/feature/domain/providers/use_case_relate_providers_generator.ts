import path from "path";
import { DefaultProjectStructureLegacy } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../core/interfaces/project_structure";
import { cap, unCap, toSnakeCase, pluralConvert } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";


export class UseCaseRelateProvidersGenerator extends DataRoutineGenerator {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCaseProviderPath(featurePath), entityName, `${entityName}_usecase_providers.dart`);
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

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../usecases/${tableName}_usecases.dart';
import '../../../data/providers/${tableName}/${tableName}_data_providers.dart';

part '${tableName}_usecase_providers.g.dart';

@riverpod
Add${D2}To${D1}UseCase? add${D2}To${D1}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${ClassName}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Add${D2}To${D1}UseCase(repository);
}

@riverpod
Remove${D2}From${D1}UseCase? remove${D2}From${D1}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${ClassName}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Remove${D2}From${D1}UseCase(repository);
}

@riverpod
RemoveAll${D2s}From${D1}UseCase? removeAll${D2s}From${D1}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${ClassName}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return RemoveAll${D2s}From${D1}UseCase(repository);
}

@riverpod
Get${D2s}For${D1}UseCase? get${D2s}For${D1}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${ClassName}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Get${D2s}For${D1}UseCase(repository);
}

@riverpod
Get${D1s}For${D2}UseCase? get${D1s}For${D2}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${ClassName}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Get${D1s}For${D2}UseCase(repository);
}
`;
  }
}