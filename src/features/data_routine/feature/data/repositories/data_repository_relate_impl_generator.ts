import path from "path";
import { BaseGenerator } from "../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, unCap, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { PathData } from "../../../../utils/path_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

/**
 * Generates the implementation of the Domain Repository for a many-to-many relation table.
 */
export class DataRepositoryRelateImplGenerator extends BaseGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDataRepositoryPath(featurePath), `${toSnakeCase(entityName)}_repository_impl.dart`);
    }

    protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
        const projectName = new PathData(featurePath).projectName;

        // Определяем имена
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        const D1 = cap(sourceField.name); // Task
        const D2 = cap(targetField.name); // Tag
        const d1 = unCap(D1); // task
        const d2 = unCap(D2); // tag
        const D1s = pluralConvert(D1);
        const D2s = pluralConvert(D2);

        const Rel = model.className; // TaskTagMap
        const IRepository = `I${Rel}Repository`;
        const RepositoryImpl = `${Rel}RepositoryImpl`;
        const ILocalDataSource = `I${Rel}LocalDataSource`;
        const localDataSource = `_${unCap(Rel)}LocalDataSource`;

        const Entity1 = `${D1}Entity`;
        const Entity2 = `${D2}Entity`;

        const idType = 'String';

        return `import 'package:${projectName}_client/${projectName}_client.dart';
import 'package:${projectName}/features/home/data/models/extensions/${d1}_model_extension.dart';
import 'package:${projectName}/features/home/data/models/extensions/${d2}_model_extension.dart';
import 'package:${projectName}/features/home/domain/entities/${d1}/${d1}.dart';
import 'package:${projectName}/features/home/domain/entities/${d2}/${d2}.dart';
import 'package:${projectName}/features/home/data/datasources/local/interfaces/${toSnakeCase(Rel)}_local_datasource_service.dart';
import 'package:${projectName}/features/home/domain/repositories/${toSnakeCase(Rel)}_repository.dart';

class ${RepositoryImpl} implements ${IRepository} {
  final Client _client;
  final ${ILocalDataSource} ${localDataSource};
  final int userId;

  ${RepositoryImpl}(this._client, this.${localDataSource}, this.userId);

  @override
  Future<void> add${D2}To${D1}({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  }) async {
    await _client.${unCap(Rel)}.add${Rel}(
      ${d1}Id: UuidValue.fromString(${d1}Id),
      ${d2}Id: UuidValue.fromString(${d2}Id),
    );
    await ${localDataSource}.addRelation(${d1}Id: ${d1}Id, ${d2}Id: ${d2}Id);
  }

  @override
  Future<void> remove${D2}From${D1}({
    required ${idType} ${d1}Id,
    required ${idType} ${d2}Id,
  }) async {
    await _client.${unCap(Rel)}.remove${Rel}(
      ${d1}Id: UuidValue.fromString(${d1}Id),
      ${d2}Id: UuidValue.fromString(${d2}Id),
    );
    await ${localDataSource}.removeRelation(${d1}Id: ${d1}Id, ${d2}Id: ${d2}Id);
  }

  @override
  Future<List<${Entity2}>> get${D2s}For${D1}(${idType} ${d1}Id) async {
    final server${D2s} = await _client.${unCap(Rel)}.get${D2s}For${D1}(UuidValue.fromString(${d1}Id));
    return server${D2s}.toModels().toEntities();
  }

  @override
  Future<List<${Entity1}>> get${D1s}For${D2}(${idType} ${d2}Id) async {
    final server${D1s} = await _client.${unCap(Rel)}.get${D1s}For${D2}(UuidValue.fromString(${d2}Id));
    return server${D1s}.toModels().toEntities();
  }

  @override
  Future<void> removeAllRelationsFor${D1}(${idType} ${d1}Id) async {
    await ${localDataSource}.removeAllFor${D1}(${d1}Id);
  }

  @override
  Future<void> removeAllRelationsFor${D2}(${idType} ${d2}Id) async {
    await ${localDataSource}.removeAllFor${D2}(${d2}Id);
  }
}
`;
    }
}