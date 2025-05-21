// src/features/data_routine/feature/data/models/extension_model_generator.ts
import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../datasources/local/tables/drift_class_parser";

export class DataExtensionModelGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDataExtensionPath(featurePath), `${entityName}_model_extension.dart`);
    }

    protected getContent(parser: DriftClassParser): string {
        const d = parser.driftClassNameLower;
        const D = parser.driftClassNameUpper;
        const fieldsSimple = parser.fieldsSimple;       // для toEntity()
        const paramsWrapValue = parser.paramsWrapValue; // для toCompanionWithId()
        const insertCompanionParams = parser.insertCompanionParams; // <--- Используем новый геттер

        return `
import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../../domain/entities/${d}/${d}.dart';
import '../${d}/${d}_model.dart';

extension ${D}ModelExtension on ${D}Model {
  ${D}Entity toEntity() => ${D}Entity(${fieldsSimple});

  ${D}TableCompanion toCompanion() =>
      ${D}TableCompanion.insert(${insertCompanionParams});

  ${D}TableCompanion toCompanionWithId() =>
      ${D}TableCompanion(${paramsWrapValue});
}

extension ${D}ModelListExtension on List<${D}Model> {
  List<${D}Entity> toEntities() =>
      map((model) => model.toEntity()).toList();
}
  `;
    }
}