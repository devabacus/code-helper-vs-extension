import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../datasources/local/tables/drift_class_parser";

export class DataModelGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;


  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataModelPath(featurePath), entityName, `${entityName}_model.dart`);
  }
  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const fields = parser.fieldsRequired;

    return `
  import 'package:freezed_annotation/freezed_annotation.dart';
  
  part '${d}_model.freezed.dart';
  part '${d}_model.g.dart';
  
  @freezed
  abstract class ${D}Model with _$${D}Model {
    const factory ${D}Model({
      ${fields}
    }) = _${D}Model;
  
    factory ${D}Model.fromJson(Map<String, dynamic> json) => _$${D}ModelFromJson(json);
  }
  `;
  }

}

