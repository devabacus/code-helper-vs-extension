import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../core/interfaces/project_structure"; //
import { cap, pluralConvert, unCap } from "../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../generators/data_routine_generator"; //
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";
import { RelationAnalyzer } from "../../../serverpod_yaml_parser/relation-analyzer";

export class DomainRepositoryGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainRepositoryPath(featurePath), `${entityName}_repository.dart`); //
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const Ds = pluralConvert(D);
    const d = unCap(D);

    let foreignKeyMethods = '';
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);

    if (relationFields.length > 0) {
      foreignKeyMethods = relationFields.map(field => {
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;
        const parameterType = 'String';

        return `
  Future<List<${D}Entity>> ${dsMethodName}(${parameterType} ${parameterName});`;
      }).join('');
    }

    return `import '../entities/${d}/${d}_entity.dart';

abstract class I${D}Repository {
  Future<List<${D}Entity>> get${Ds}();
  Stream<List<${D}Entity>> watch${Ds}();
  Future<${D}Entity?> get${D}ById(String id);
  Future<List<${D}Entity>> get${Ds}ByIds(List<String> ids);
  Future<String> create${D}(${D}Entity ${d});
  Future<bool> update${D}(${D}Entity ${d});
  Future<bool> delete${D}(String id);
  Future<void> syncWithServer();
  void initEventBasedSync();
  void dispose();
  ${foreignKeyMethods}
}

`;
  }
}