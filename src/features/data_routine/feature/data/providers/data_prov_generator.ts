import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import * as path from "path";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";

export class DataProviderGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataProvderPath(featurePath), entityName, `${entityName}_data_providers.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;

return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../../core/database/local/provider/database_provider.dart';
import '../../../domain/repositories/${d}_repository.dart';
import '../../datasources/local/dao/${d}/${d}_dao.dart';
import '../../datasources/local/interfaces/${d}_local_datasource_service.dart';
import '../../datasources/local/sources/${d}_local_data_source.dart';
import '../../repositories/${d}_repository_impl.dart';

part '${d}_data_providers.g.dart';

@riverpod
${D}Dao ${d}Dao(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return ${D}Dao(databaseService);
}

@riverpod
I${D}LocalDataSource ${d}LocalDataSource(Ref ref) {
  final ${d}Dao = ref.read(${d}DaoProvider);
  return ${D}LocalDataSource(${d}Dao);
}

@riverpod
I${D}Repository ${d}Repository(Ref ref) {
  final localDataSource = ref.read(${d}LocalDataSourceProvider);
  return ${D}RepositoryImpl(localDataSource);
}

`;
  }
}

