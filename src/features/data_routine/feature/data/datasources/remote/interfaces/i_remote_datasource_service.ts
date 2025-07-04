import path from "path";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, unCap } from "../../../../../../../utils/text_work/text_util";
import { PathData } from "../../../../../../utils/path_util";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";
import { RelationAnalyzer } from "../../../../../serverpod_yaml_parser/relation-analyzer";

export class RemoteDataSourceServiceGenerator extends BaseGenerator<ServerpodModel> {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataRemoteInterfacesPath(featurePath), `${entityName}_remote_datasource_service.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;

    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    // Генерация методов для получения по внешнему ключу
    let foreignKeyMethods = '';
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);

    if (relationFields.length > 0) {
      foreignKeyMethods = relationFields.map(field => {
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;

        return `
  Future<List<${D}>> ${dsMethodName}(UuidValue ${parameterName});`;
      }).join('');
    }
    return `
import 'package:${projectName}_client/${projectName}_client.dart';

abstract class I${D}RemoteDataSource {
  Stream<${D}SyncEvent> watchEvents();
  Future<List<${D}>> get${Ds}();
  Future<List<${D}>> get${Ds}Since(DateTime? since); 
  Future<List<${D}>> sync${Ds}(List<${D}> local${Ds});
  Future<${D}?> get${D}ById(UuidValue id);
  Future<${D}> create${D}(${D} ${d});
  Future<bool> update${D}(${D} ${d});
  Future<bool> delete${D}(UuidValue id);
  Future<bool> checkConnection();
${foreignKeyMethods}
}

`;
  }
}