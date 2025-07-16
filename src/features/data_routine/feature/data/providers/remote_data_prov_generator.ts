import * as path from "path";
import { DefaultProjectStructureLegacy } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class RemoteDataProviderGenerator extends DataRoutineGenerator {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataProvderPath(featurePath), entityName, `${entityName}_remote_data_providers.dart`);
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(D);
    const ds = pluralConvert(d);

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../datasources/remote/interfaces/${d}_remote_datasource_service.dart';
import '../../datasources/remote/sources/${d}_remote_data_source.dart';
import '../../../../../core/providers/serverpod_client_provider.dart';

part '${d}_remote_data_providers.g.dart';

@riverpod
I${D}RemoteDataSource ${d}RemoteDataSource(Ref ref) {
  ref.keepAlive();
  final client = ref.watch(serverpodClientProvider);
  return ${D}RemoteDataSource(client); 
}

@riverpod
Future<bool> ${d}RemoteConnectionCheck(Ref ref) async {
  final remoteDataSource = ref.watch(${d}RemoteDataSourceProvider);
  return await remoteDataSource.checkConnection();
}
`;
  }
}

