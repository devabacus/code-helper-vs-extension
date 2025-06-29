import path from "path";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

/**
 * Generates the Interface for the Local Data Source of a many-to-many relation table.
 */
export class DataLocalRelateServiceGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    // Путь к файлу интерфейса
    return path.join(this.structure.getDataLocalInterfacesPath(featurePath), `${toSnakeCase(entityName)}_local_datasource_service.dart`);
  }

  protected getContent(model: ServerpodModel): string {

    // Определяем имена сущностей
    const sourceField = model.fields[0];
    const targetField = model.fields[1];

    const D1 = cap(sourceField.name); // Task
    const D2 = cap(targetField.name); // Tag
    const d1 = unCap(D1); // task
    const d2 = unCap(D2); // tag

    // Имена для связующей таблицы
    const Rel = model.className; // TaskTagMap
    const IDataSource = `I${Rel}LocalDataSource`; // ITaskTagMapLocalDataSource
    const TableData = `${Rel}TableData`; // TaskTagMapTableData

    const idType = 'String';

    return `import '../../../../../../core/database/local/database.dart';

abstract class ${IDataSource} {
  /// Creates a connection between a ${D1} and a ${D2}.
  Future<void> addRelation({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  });

  /// Removes a connection between a ${D1} and a ${D2}.
  Future<int> removeRelation({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  });

  /// Gets all relations for a specific ${D1}.
  Future<List<${TableData}>> getRelationsFor${D1}(${idType} ${d1}Id);

  /// Gets all relations for a specific ${D2}.
  Future<List<${TableData}>> getRelationsFor${D2}(${idType} ${d2}Id);

  /// Removes all connections for a specific ${D1}.
  Future<int> removeAllFor${D1}(${idType} ${d1}Id);

  /// Removes all connections for a specific ${D2}.
  Future<int> removeAllFor${D2}(${idType} ${d2}Id);
}
`;
  }
}