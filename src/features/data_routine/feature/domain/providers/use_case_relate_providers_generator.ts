import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, unCap, toSnakeCase, pluralConvert } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

/**
 * Generates Riverpod providers for all Use Cases of a many-to-many relation table.
 */
export class UseCaseRelateProvidersGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDomainUseCaseProviderPath(featurePath), toSnakeCase(entityName), `${toSnakeCase(entityName)}_relate_usecase_providers.dart`);
    }

    protected getContent(model: ServerpodModel): string {
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        const D1 = cap(sourceField.name); // Task
        const D2 = cap(targetField.name); // Tag

        const Rel = model.className; // TaskTagMap
        const rel = unCap(Rel);       // taskTagMap

        // Названия Use Cases
        const useCases = [
            `Add${D2}To${D1}UseCase`,
            `Remove${D2}From${D1}UseCase`,
            `Get${cap(pluralConvert(D2))}For${D1}UseCase`,
            `Get${cap(pluralConvert(D1))}For${D2}UseCase`,
            `RemoveAllRelationsFor${D1}UseCase`,
            `RemoveAllRelationsFor${D2}UseCase`
        ];

        // Генерируем провайдеры для каждого Use Case
        const providers = useCases.map(useCaseName => {
            const providerName = `${unCap(useCaseName)}Provider`;
            return `
@riverpod
${useCaseName}? ${providerName}(Ref ref) {
  final repository = ref.watch(currentUser${Rel}RepositoryProvider);
  if (repository == null) {
    // User is not authorized
    return null;
  }
  return ${useCaseName}(repository);
}`;
        }).join('\n');

        return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../usecases/${toSnakeCase(rel)}/relate_usecases.dart';
import '../../../data/providers/${toSnakeCase(rel)}/${toSnakeCase(rel)}_relate_data_providers.dart';

part '${toSnakeCase(rel)}_relate_usecase_providers.g.dart';
${providers}
`;
    }
}