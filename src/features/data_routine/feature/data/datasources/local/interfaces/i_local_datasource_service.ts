import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure"; 
import { IFileSystem } from "../../../../../../../core/interfaces/file_system"; 
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure"; 
import { cap, pluralConvert, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util"; 
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator"; 
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/types";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { PathData } from "../../../../../../utils/path_util";




export class LocalDataSourceServiceGenerator extends BaseGenerator<ServerpodModel> {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    const snakeCaseEntityName = toSnakeCase(entityName);
    
    return path.join(this.structure.getDataLocalInterfacesPath(featurePath), `${snakeCaseEntityName}_local_datasource_service.dart`); 
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;
    
    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    // Генерация методов для получения по внешнему ключу
    let foreignKeyMethods = '';
    const relationFields = model.fields.filter(field => field.isRelation && field.relationType === 'manyToOne');

    if (relationFields.length > 0) {
      foreignKeyMethods = relationFields.map(field => {
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;
        const parameterType = 'String';

        return `
  Future<List<${D}Model>> ${dsMethodName}(${parameterType} ${parameterName}, {required int userId}); `;
      }).join('');
    }
    return `
import 'package:${projectName}/core/database/local/database.dart';

import '../../../models/${d}/${d}_model.dart';
import '../../../../../../core/database/local/database_types.dart';

abstract class I${D}LocalDataSource {
  Future<List<${D}Model>> get${Ds}({int? userId});
  Stream<List<${D}Model>> watch${Ds}({int? userId});
  Future<${D}Model?> get${D}ById(String id, {required int userId});
  Future<String> create${D}(${D}Model ${d});
  Future<bool> update${D}(${D}Model ${d});
  Future<bool> delete${D}(String id, {required int userId});
  Future<List<${D}TableData>> getAllLocalChanges(int userId);
  Future<List<${D}TableData>> reconcileServerChanges(
    List<dynamic> serverChanges,
    int userId,
  );
  Future<void> physicallyDelete${D}(String id, {required int userId});
  Future<void> insertOrUpdateFromServer(
    dynamic serverChange,
    SyncStatus status,
  );
  Future<void> handleSyncEvent(dynamic event, int userId);
${foreignKeyMethods}
}

`;
  }
}