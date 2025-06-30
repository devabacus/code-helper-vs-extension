import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, cap, unCap, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

/**
 * Generates a single file containing all Use Cases for a many-to-many relation table,
 * following the user's existing style.
 */
export class UseCaseRelateGenerator extends DataRoutineGenerator {
    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDomainUseCasesPath(featurePath), toSnakeCase(entityName), "relate_usecases.dart");
    }

    protected getContent(model: ServerpodModel): string {
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        const D1 = cap(sourceField.name); // Task
        const D2 = cap(targetField.name); // Tag
        const d1 = unCap(D1); // task
        const d2 = unCap(D2); // tag
        const D1s = pluralConvert(D1); // Tasks
        const D2s = pluralConvert(D2); // Tags

        const Rel = model.className; // TaskTagMap
        const IRepository = `I${Rel}Repository`;
        const repository = `_${unCap(Rel)}Repository`;
        const idType = 'String';

        const Entity1 = `${D1}Entity`;
        const Entity2 = `${D2}Entity`;

        // --- Генерируем все классы Use Case ---
        const useCases = `
// --- Use Case to Add Relation ---
class Add${D2}To${D1}UseCase {
  final ${IRepository} ${repository};
  Add${D2}To${D1}UseCase(this.${repository});

  Future<void> call({required ${idType} ${d1}Id, required ${idType} ${d2}Id}) {
    return ${repository}.add${D2}To${D1}(${d1}Id: ${d1}Id, ${d2}Id: ${d2}Id);
  }
}

// --- Use Case to Remove Relation ---
class Remove${D2}From${D1}UseCase {
  final ${IRepository} ${repository};
  Remove${D2}From${D1}UseCase(this.${repository});

  Future<void> call({required ${idType} ${d1}Id, required ${idType} ${d2}Id}) {
    return ${repository}.remove${D2}From${D1}(${d1}Id: ${d1}Id, ${d2}Id: ${d2}Id);
  }
}

// --- Use Case to Get Targets for a Source ---
class Get${D2s}For${D1}UseCase {
  final ${IRepository} ${repository};
  Get${D2s}For${D1}UseCase(this.${repository});

  Future<List<${Entity2}>> call(${idType} ${d1}Id) {
    return ${repository}.get${D2s}For${D1}(${d1}Id);
  }
}

// --- Use Case to Get Sources for a Target ---
class Get${D1s}For${D2}UseCase {
  final ${IRepository} ${repository};
  Get${D1s}For${D2}UseCase(this.${repository});

  Future<List<${Entity1}>> call(${idType} ${d2}Id) {
    return ${repository}.get${D1s}For${D2}(${d2}Id);
  }
}

// --- Use Case to Remove All Relations for a Source ---
class RemoveAllRelationsFor${D1}UseCase {
    final ${IRepository} ${repository};
    RemoveAllRelationsFor${D1}UseCase(this.${repository});

    Future<void> call(${idType} ${d1}Id) {
        return ${repository}.removeAllRelationsFor${D1}(${d1}Id);
    }
}

// --- Use Case to Remove All Relations for a Target ---
class RemoveAllRelationsFor${D2}UseCase {
    final ${IRepository} ${repository};
    RemoveAllRelationsFor${D2}UseCase(this.${repository});

    Future<void> call(${idType} ${d2}Id) {
        return ${repository}.removeAllRelationsFor${D2}(${d2}Id);
    }
}
`;
        // --- Собираем финальный файл ---
        const imports = `import '../../repositories/${toSnakeCase(Rel)}_repository.dart';
import '../../entities/${d1}/${d1}.dart';
import '../../entities/${d2}/${d2}.dart';`;

        return `${imports}\n${useCases}`;
    }
}