// src/features/data_routine/feature/data/models/extension_model_generator.ts
import path from "path";
import { BaseGenerator } from "../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { toCamelCase } from "../../../../../utils/text_work/text_util";
import { CodeFormatter } from "../../../serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";
import { PathData } from "../../../../utils/path_util";

export class DataExtensionModelGenerator extends BaseGenerator<ServerpodModel> {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataExtensionPath(featurePath), `${entityName}_model_extension.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;
    const D = model.className;
    const d = toCamelCase(model.className);
    const formatter = new CodeFormatter();

    const params = formatter.formatSimpleFields(model.fields);
    const paramValueWrapped = formatter.formatInsertCompanionParams(model.fields);

    return `
import 'package:drift/drift.dart';

import '../../../../../../../core/database/local/database.dart';
import 'package:${projectName}_client/${projectName}_client.dart' as serverpod;
import '../../../domain/entities/${d}/${d}.dart';
import '../../../../../core/database/local/database_types.dart';
import '../${d}/${d}_model.dart';

extension ${D}ModelExtension on ${D}Model {
  ${D}Entity toEntity() => ${D}Entity(
        id: id,
        lastModified: lastModified,
        userId: userId,
         ${params}
      );

  ${D}TableCompanion toCompanion() => ${D}TableCompanion(
        id: Value(id),
        lastModified: Value(lastModified), 
        userId: Value(userId),
        syncStatus: Value(SyncStatus.local), // По умолчанию новые записи требуют синхронизации
        ${paramValueWrapped}

      );
  
  ${D}TableCompanion toCompanionWithId() => toCompanion();
}

extension ${D}ModelListExtension on List<${D}Model> {
  List<${D}Entity> toEntities() =>
      map((model) => model.toEntity()).toList();
}

extension Serverpod${D}ToModelExtension on serverpod.${D} {
  ${D}Model toModel() => ${D}Model(
        id: id.toString(),
        lastModified: lastModified ?? DateTime.now().toUtc(),
        userId: userId,
        ${params}
      );
}


extension Serverpod${D}ListToModelListExtension on List<serverpod.${D}> {
  List<${D}Model> toModels() =>
      map((serverpodModel) => serverpodModel.toModel()).toList();
}

  `;
  }
}