import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../core/interfaces/project_structure"; //
import { cap, pluralConvert, unCap } from "../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class UseCaseProvidersGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCaseProviderPath(featurePath), entityName, `${entityName}_usecase_providers.dart`); //
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);
    let foreignKeyProviders = '';
    const relationFields = model.fields.filter(field => field.isRelation && field.relationType === 'manyToOne');

    if (relationFields.length > 0) {
      const providersData = relationFields.map(field => {
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        // e.g., getTasksByCategoryId
        const useCaseMethodName = `get${Ds}By${methodNamePart}Id`;
        // e.g., GetTasksByCategoryIdUseCase
        const useCaseClassName = `${cap(useCaseMethodName)}UseCase`;
        // e.g., getTasksByCategoryIdUseCase
        const useCaseProviderName = `${unCap(useCaseMethodName)}UseCase`;

        // Преобразуем имя метода в snake_case для имени файла
        // e.g., get_tasks_by_category_id
        const snakeCaseMethodName = useCaseMethodName
          .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
          .substring(1);

        const importStatement = `import '../../usecases/${d}/${snakeCaseMethodName}.dart';`;

        const providerStatement = `
@riverpod
${useCaseClassName}? ${useCaseProviderName}(Ref ref) {
  final repository = ref.watch(currentUser${D}RepositoryProvider);
  if (repository == null) {
    // пользователь не авторизован
    return null;
  }
  return ${useCaseClassName}(repository);
}`;
        return { importStatement, providerStatement };
      });
      foreignKeyProviders = providersData.map(p => p.providerStatement).join('\n\n');
    }

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../usecases/${d}_base_usecases.dart';
import '../../../data/providers/${d}/${d}_data_providers.dart';

part '${d}_usecase_providers.g.dart';

@riverpod
Get${Ds}UseCase? get${Ds}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${D}RepositoryProvider);
  if (repository == null) {
    // пользователь не авторизован
    return null;
  }
  return Get${Ds}UseCase(repository);
}   

@riverpod
Watch${Ds}UseCase? watch${Ds}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${D}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Watch${Ds}UseCase(repository);
}

@riverpod
Create${D}UseCase? create${D}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${D}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Create${D}UseCase(repository);
}

@riverpod
Delete${D}UseCase? delete${D}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${D}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Delete${D}UseCase(repository);
}

@riverpod
Update${D}UseCase? update${D}UseCase(Ref ref) {
  final repository = ref.watch(currentUser${D}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Update${D}UseCase(repository);
}

@riverpod
Get${D}ByIdUseCase? get${D}ByIdUseCase(Ref ref) {
  final repository = ref.watch(currentUser${D}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return Get${D}ByIdUseCase(repository);
}
  ${foreignKeyProviders}

    `;
  }
}