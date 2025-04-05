import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";

export class DomainExtensionEntityGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;


  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainExtensionPath(featurePath), `${entityName}_entity_extension.dart`);
  }
  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const fieldsSimple = parser.fieldsSimple;

    return `
import '../../entities/${d}/${d}.dart';
import '../../../data/models/${d}/${d}_model.dart';

extension ${D}EntityExtension on ${D}Entity {
  ${D}Model toModel() => ${D}Model(${fieldsSimple});
}

extension ${D}EntityListExtension on List<${D}Entity> {
  List<${D}Model> toModels() => map((entity) => entity.toModel()).toList();
}   
  `;
  }
}

