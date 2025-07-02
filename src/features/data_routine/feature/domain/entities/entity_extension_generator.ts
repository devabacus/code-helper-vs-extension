import path from "path";

import { BaseGenerator } from "../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { toCamelCase, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { PathData } from "../../../../utils/path_util";
import { CodeFormatter } from "../../../serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class DomainExtensionEntityGenerator extends BaseGenerator {

  private structure: ProjectStructure;


  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainExtensionPath(featurePath), `${entityName}_entity_extension.dart`);
  }
  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;
    const D = model.className;
    const d = toSnakeCase(D);

    const formatter = new CodeFormatter();
    const params = formatter.formatSimpleFields(model.fields);
    let paramsServerpod = params;
    if (params.includes('Id') && !model.isRelation) {
      paramsServerpod = params.replace(/: (\w+)Id/g, ': $1Id == null ? null : serverpod.UuidValue.fromString($1Id!)');

    } else if (model.isRelation){
      paramsServerpod = params.replace(/: (\w+)Id/g, ': serverpod.UuidValue.fromString($1Id)')
    }
    return `import '../../entities/${d}/${d}.dart';
import '../../../data/models/${d}/${d}_model.dart';
import 'package:${projectName}_client/${projectName}_client.dart' as serverpod;

extension ${D}EntityExtension on ${D}Entity {
  ${D}Model toModel() => ${D}Model(
        id: id,
        lastModified: lastModified,
        userId: userId,
        ${params}
      );
}

extension ${D}EntityListExtension on List<${D}Entity> {
  List<${D}Model> toModels() => map((entity) => entity.toModel()).toList();
}

extension Serverpod${D}EntityExtensions on ${D}Entity {
  serverpod.${D} toServerpod${D}() => serverpod.${D}(
    id: serverpod.UuidValue.fromString(id),
    lastModified: lastModified,
    userId: userId,
    isDeleted: false,
    ${paramsServerpod}
  );
  }
`;
  }

}





