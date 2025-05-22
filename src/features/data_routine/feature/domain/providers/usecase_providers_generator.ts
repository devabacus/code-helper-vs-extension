import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../core/interfaces/project_structure"; //
import { pluralConvert, cap, toSnakeCase, toCamelCase } from "../../../../../utils/text_work/text_util"; //
import { Reference } from "../../../../../core/interfaces/drift_table_parser"; //
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../data/datasources/local/tables/drift_table_parser";

export class UseCaseProvidersGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCaseProviderPath(featurePath), entityName, `${entityName}_usecase_providers.dart`); //
  }

  protected getContent(data: { classParser: DriftClassParser, tableParser: DriftTableParser }): string {
    const classParser = data.classParser;
    const tableParser = data.tableParser;

    if (!classParser) {
        console.error("UseCaseProvidersGenerator: classParser не определен в 'data'.");
        return "// Ошибка: Не удалось получить classParser для генерации провайдеров UseCase.";
    }

    const d = classParser.driftClassNameLower; // task
    const D = classParser.driftClassNameUpper; // Task
    const Ds = pluralConvert(D); // Tasks

    let foreignKeyUseCaseImports = '';
    let foreignKeyUseCaseProviders = '';

    if (tableParser) {
        const references: Reference[] = tableParser.getReferences(); //

        if (references && references.length > 0) {
            foreignKeyUseCaseImports = references.map(ref => {
                const fkFieldName = ref.columnName; // categoryId
                let methodNamePart = cap(fkFieldName); // CategoryId
                if (methodNamePart.endsWith('Id')) {
                    methodNamePart = methodNamePart.slice(0, -2); // Category
                }
                const useCaseFileName = `get_${pluralConvert(d)}_by_${toSnakeCase(methodNamePart)}_id.dart`; // get_tasks_by_category_id.dart
                return `import '../../usecases/${d}/${useCaseFileName}';`;
            }).join('\n');

            foreignKeyUseCaseProviders = references.map(ref => {
                const fkFieldName = ref.columnName; // categoryId
                let methodNamePart = cap(fkFieldName); // CategoryId
                if (methodNamePart.endsWith('Id')) {
                    methodNamePart = methodNamePart.slice(0, -2); // Category
                }
                
                const useCaseClassName = `Get${Ds}By${methodNamePart}IdUseCase`; // GetTasksByCategoryIdUseCase
                const providerName = `${toCamelCase(useCaseClassName)}Provider`; // getTasksByCategoryIdUseCaseProvider

                return `
@riverpod
${useCaseClassName} ${toCamelCase(useCaseClassName)}(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return ${useCaseClassName}(repository);
}`;
            }).join('\n');
        }
    }

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../usecases/${d}/create.dart';
import '../../usecases/${d}/delete.dart';
import '../../usecases/${d}/get_by_id.dart';
import '../../usecases/${d}/update.dart';
import '../../usecases/${d}/get_all.dart';
import '../../usecases/${d}/watch_all.dart';
${foreignKeyUseCaseImports}
import '../../../data/providers/${d}/${d}_data_providers.dart';

part '${d}_usecase_providers.g.dart';

@riverpod
Get${Ds}UseCase get${Ds}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Get${Ds}UseCase(repository);
}

@riverpod
Watch${Ds}UseCase watch${Ds}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Watch${Ds}UseCase(repository);
}

@riverpod
Create${D}UseCase create${D}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Create${D}UseCase(repository);
}

@riverpod
Delete${D}UseCase delete${D}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Delete${D}UseCase(repository);
}

@riverpod
Update${D}UseCase update${D}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Update${D}UseCase(repository);
}

@riverpod
Get${D}ByIdUseCase get${D}ByIdUseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Get${D}ByIdUseCase(repository);
}
${foreignKeyUseCaseProviders}  
  `;
  }
}