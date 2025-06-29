import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, unCap, toSnakeCase, pluralConvert } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class DomainRelateRepositoryGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDomainRepositoryPath(featurePath), `${toSnakeCase(entityName)}_repository.dart`);
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
        const IRepository = `I${Rel}Repository`; // ITaskTagMapRepository

        // В доменном слое мы работаем с Entity
        const Entity1 = `${D1}Entity`;
        const Entity2 = `${D2}Entity`;

        const idType = 'String';

        return `import '../entities/${d1}/${d1}.dart';
import '../entities/${d2}/${d2}.dart';

abstract class ${IRepository} {
  /// Connects a ${D2} to a ${D1}.
  Future<void> add${D2}To${D1}({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  });

  /// Disconnects a ${D2} from a ${D1}.
  Future<void> remove${D2}From${D1}({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  });

  /// Gets all ${D2s} associated with a specific ${D1}.
  Future<List<${Entity2}>> get${D2s}For${D1}(${idType} ${d1}Id);
  
  /// Gets all ${D1s} associated with a specific ${D2}.
  Future<List<${Entity1}>> get${D1s}For${D2}(${idType} ${d2}Id);

  /// Removes all connections for a specific ${D1}.
  Future<void> removeAllRelationsFor${D1}(${idType} ${d1}Id);
}
`;
    }
}