import path from "path";

import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { toCamelCase } from "../../../../../utils/text_work/text_util";
import { CodeFormatter } from "../../../serverpod_yaml_parser/formatters/code_formatter";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class EntityGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;


  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getEntityPath(featurePath), entityName, `${entityName}.dart`);
  }
  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = toCamelCase(D);

    const formatter = new CodeFormatter();
    const params = formatter.formatRequiredTypeFields(model.fields);
    return `import 'package:freezed_annotation/freezed_annotation.dart';

part '${d}.freezed.dart';
part '${d}.g.dart';

@freezed
abstract class ${D}Entity with _$${D}Entity {
  const factory ${D}Entity({
    required String id,
    required DateTime lastModified,
    required int userId,
    ${params}
  }) = _${D}Entity;

  factory ${D}Entity.fromJson(Map<String, dynamic> json) => _$${D}EntityFromJson(json);
}
`;
  }

}


