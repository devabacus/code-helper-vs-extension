// src/features/data_routine/generators/entity_generator.ts
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import * as path from "path";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { DriftCodeFormatter } from "../../../formatters/drift_code_formatter";

export class EntityGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getEntityPath(featurePath), entityName, `${entityName}.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const D = parser.driftClassNameUpper;
    const d = parser.driftClassNameLower;
    // const fields = parser.fieldsRequired;

    // Создаем форматтер
  const formatter = new DriftCodeFormatter();
  // Используем метод formatRequiredTypeFields для получения полей в правильном формате
  const formattedFields = formatter.formatRequiredTypeFields(parser.fields);

    return `
import 'package:freezed_annotation/freezed_annotation.dart';

part '${d}.freezed.dart';
part '${d}.g.dart';

@freezed
abstract class ${D}Entity with _$${D}Entity {
  const factory ${D}Entity({
    ${formattedFields}
  }) = _${D}Entity;

  factory ${D}Entity.fromJson(Map<String, dynamic> json) => _$${D}EntityFromJson(json);
}
`;
  }
}
