import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, unCap, toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";
import { PathData } from "../../../../../../utils/path_util";

/**
 * Generates a Local Data Source for a many-to-many relation table.
 * It's a simple wrapper around the corresponding DAO.
 */
export class DataLocalRelateSourceGenerator extends BaseGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getLocalDataSourcePath(featurePath), `${toSnakeCase(entityName)}_local_data_source.dart`);
    }

    protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
        const projectName = new PathData(featurePath).projectName;

        // Определяем имена сущностей
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        const D1 = cap(sourceField.name); // Task
        const D2 = cap(targetField.name); // Tag
        const d1 = unCap(D1); // task
        const d2 = unCap(D2); // tag

        // Имена для связующей таблицы
        const Rel = model.className; // TaskTagMap
        const relDao = `${unCap(Rel)}Dao`; // taskTagMapDao
        const Dao = `${Rel}Dao`; // TaskTagMapDao
        const DataSource = `${Rel}LocalDataSource`; // TaskTagMapLocalDataSource
        const IDataSource = `I${DataSource}`; // ITaskTagMapLocalDataSource
        const TableData = `${Rel}TableData`; // TaskTagMapTableData

        const idType = 'String';

        return `import '../../../../../../core/database/local/database.dart';
import '../dao/${toSnakeCase(Rel)}/${toSnakeCase(Rel)}_dao.dart';
import '../interfaces/${toSnakeCase(Rel)}_local_datasource_service.dart';

class ${DataSource} implements ${IDataSource} {
  final ${Dao} _${relDao};

  ${DataSource}(this._${relDao});

  @override
  Future<void> addRelation({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  }) {
    return _${relDao}.addRelation(${d1}Id: ${d1}Id, ${d2}Id: ${d2}Id);
  }

  @override
  Future<int> removeRelation({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  }) {
    return _${relDao}.removeRelation(${d1}Id: ${d1}Id, ${d2}Id: ${d2}Id);
  }

  @override
  Future<List<${TableData}>> getRelationsFor${D1}(${idType} ${d1}Id) {
    return _${relDao}.getRelationsFor${D1}(${d1}Id);
  }

  @override
  Future<List<${TableData}>> getRelationsFor${D2}(${idType} ${d2}Id) {
    return _${relDao}.getRelationsFor${D2}(${d2}Id);
  }

  @override
  Future<int> removeAllFor${D1}(${idType} ${d1}Id) {
    return _${relDao}.removeAllFor${D1}(${d1}Id);
  }

  @override
  Future<int> removeAllFor${D2}(${idType} ${d2}Id) {
    return _${relDao}.removeAllFor${D2}(${d2}Id);
  }
}
`;
    }
}