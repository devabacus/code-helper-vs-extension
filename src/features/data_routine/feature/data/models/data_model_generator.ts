import path from "path";

import { DefaultProjectStructureLegacy } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../core/interfaces/project_structure";
import { toCamelCase, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { CodeFormatter } from "../../../serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class ModelGenerator extends DataRoutineGenerator {

  private structure: IProjectStructureLegacy;


  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataModelPath(featurePath), entityName, `${entityName}_model.dart`);
  }
  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = toSnakeCase(D);

    const formatter = new CodeFormatter();
    const params = formatter.formatRequiredTypeFields(model.fields);
    return `import 'package:freezed_annotation/freezed_annotation.dart';

part '${d}_model.freezed.dart';
part '${d}_model.g.dart';

@freezed
abstract class ${D}Model with _$${D}Model {
  const factory ${D}Model({
    required String id,
    required int userId,
    required String customerId,
    required DateTime createdAt,
    required DateTime lastModified,
    @Default(false) bool isDeleted,
    ${params}
  }) = _${D}Model;

  factory ${D}Model.fromJson(Map<String, dynamic> json) => _$${D}ModelFromJson(json);
}
`;
  }

}

