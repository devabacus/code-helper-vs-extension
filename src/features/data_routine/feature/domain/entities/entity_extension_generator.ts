import path from "path";

import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { toCamelCase } from "../../../../../utils/text_work/text_util";
import { CodeFormatter } from "../../../formatters/code_formatter";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/types";

export class DomainExtensionEntityGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;


  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainExtensionPath(featurePath), `${entityName}_entity_extension.dart`);
  }
  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = toCamelCase(D);

    const formatter = new CodeFormatter();
    const params = formatter.formatSimpleFields(model.fields);
    return `import '../../entities/${d}/${d}.dart';
import '../../../data/models/${d}/${d}_model.dart';

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
`;
  }

}





