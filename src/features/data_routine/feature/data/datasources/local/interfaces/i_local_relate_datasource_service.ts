import path from "path";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

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

  const d1 = model.fields[1].relatedModel!;
        const d2 = model.fields[2].relatedModel!;       

        const D1 = cap(d1);
        const D2 = cap(d2);
        const ClassName = `${model.className}`; 
        const tableName = `${model.tableName}`;


    const idType = 'String';

    return `import '../../../../../../core/database/local/database.dart';
import '../../../../../../core/database/local/database_types.dart';
import '../../../models/${tableName}/${tableName}_model.dart';

abstract class I${ClassName}LocalDataSource {
  // === Основные CRUD-операции ===
  Future<String> create${ClassName}(${ClassName}Model model);
  Future<bool> update${ClassName}(${ClassName}Model model);
  Future<bool> softDelete${ClassName}ById(String id, {required int userId});
  Future<int> softDeleteRelationsBy${D1}Id(String ${d1}Id, {required int userId});

  Future<${ClassName}Model?> getRelationById(String id, {required int userId});
  Future<${ClassName}Model?> getRelationBy${D1}And${D2}(String ${d1}Id, String ${d2}Id, {required int userId});
  Stream<List<${ClassName}Model>> watchAllRelations({required int userId});

  Future<List<${ClassName}TableData>> getAllLocalChanges(int userId);
  Future<List<${ClassName}TableData>> reconcileServerChanges(List<dynamic> serverChanges, int userId);
  Future<int> physicallyDelete${ClassName}(String id, {required int userId});
  Future<void> insertOrUpdateFromServer(dynamic serverChange, SyncStatus status);
  Future<void> handleSyncEvent(dynamic event, int userId);
}
`;
  }
}