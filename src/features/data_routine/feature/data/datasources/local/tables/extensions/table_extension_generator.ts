import path from "path";
import { DefaultProjectStructureLegacy } from "../../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../../../../core/interfaces/project_structure";
import { toCamelCase, toSnakeCase, unCap } from "../../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../../../../serverpod_yaml_parser/formatters/types";
import { CodeFormatter } from "../../../../../../serverpod_yaml_parser/formatters/code_formatter";
import { PathData } from "../../../../../../../utils/path_util";
import { BaseGenerator } from "../../../../../../../../core/generators/base_generator";


export class TableExtensionGenerator extends BaseGenerator<ServerpodModel> {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getTableExtension(featurePath), `${entityName}_table_extension.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;
    const D = model.className;
    const d = toSnakeCase(model.className);
    const formatter = new CodeFormatter();

    const params = formatter.formatSimpleFields(model.fields);
    const paramValueWrapped = formatter.formatInsertCompanionParams(model.fields);
    // const valueWrappedToString = paramValueWrapped.replace(/Value(.*Id)/g, ': Value$1.toString()');
    const valueWrappedToString = paramValueWrapped.split(',').map(p => p.replace(/(.*Id)/, '$1.toString()')).join(',');

    return `import 'package:drift/drift.dart';
import 'package:${projectName}_client/${projectName}_client.dart' as serverpod;

import '../../../../../../../core/database/local/database.dart';
import '../../../../models/${d}/${d}_model.dart';
import '../../../../../../../core/database/local/database_types.dart';

extension ${D}TableDataExtensions on ${D}TableData {
  ${D}Model toModel() => ${D}Model(id: id, userId: userId, customerId: customerId, createdAt: createdAt, lastModified: lastModified, isDeleted: isDeleted, ${params});
}

extension ${D}TableDataListExtensions on List<${D}TableData> {
  List<${D}Model> toModels() => map((data)=> data.toModel()).toList();
}

extension Serverpod${D}TableExtensions on serverpod.${D} {
  ${D}TableCompanion toCompanion(SyncStatus status) =>
      ${D}TableCompanion(
        id: Value(id.toString()),
        userId: Value(userId),
        customerId: Value(customerId.toString()),
        createdAt: Value(createdAt),
        lastModified: Value(lastModified),
        isDeleted: Value(isDeleted),
        syncStatus: Value(status),
        ${valueWrappedToString}
  );
}

`;
  }
}

