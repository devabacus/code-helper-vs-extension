// src/features/data_routine/feature/data/models/extension_model_generator.ts
import path from "path";
import { BaseGenerator } from "../../../../../core/generators/base_generator";
import { DefaultProjectStructureLegacy } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../core/interfaces/project_structure";
import { toCamelCase, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { CodeFormatter } from "../../../serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";
import { PathData } from "../../../../utils/path_util";

export class DataExtensionModelGenerator extends BaseGenerator<ServerpodModel> {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataExtensionPath(featurePath), `${entityName}_model_extension.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;
    const D = model.className;
    const d = toSnakeCase(model.className);
    const formatter = new CodeFormatter();

    const params = formatter.formatSimpleFields(model.fields);
    const paramValueWrapped = formatter.formatInsertCompanionParams(model.fields);
    const nullable = model.isRelation ? '' : '?';
    const paramsToString = params.split(',').map(p => p.replace(/(.*Id)/, `$1${nullable}.toString()`)).join(','); //преобразуем поля с Id из UUidValue в String

    return `
import 'package:drift/drift.dart';

import '../../../../../../../core/database/local/database.dart';
import 'package:${projectName}_client/${projectName}_client.dart' as serverpod;
import '../../../domain/entities/${d}/${d}_entity.dart';
import '../../../../../core/database/local/database_types.dart';
import '../${d}/${d}_model.dart';

extension ${D}ModelExtension on ${D}Model {
  ${D}Entity toEntity() => ${D}Entity(
        id: id,
        userId: userId,
        customerId: customerId,
        createdAt: createdAt,
        lastModified: lastModified,
        isDeleted: isDeleted,
         ${params}
      );

  ${D}TableCompanion toCompanion() => ${D}TableCompanion(
        id: Value(id),
        userId: Value(userId),
        customerId: Value(customerId),
        createdAt: Value(createdAt),
        lastModified: Value(lastModified),
        isDeleted: Value(isDeleted),
        syncStatus: Value(SyncStatus.local),
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
        userId: userId,
        customerId: customerId.toString(),
        createdAt: createdAt,
        lastModified: lastModified,
        isDeleted: isDeleted,
        ${paramsToString}
      );
}

extension Serverpod${D}ListToModelListExtension on List<serverpod.${D}> {
  List<${D}Model> toModels() =>
      map((serverpodModel) => serverpodModel.toModel()).toList();
}

  `;
  }
}