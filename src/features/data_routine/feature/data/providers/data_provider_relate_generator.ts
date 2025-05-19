import path from "path";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../datasources/local/tables/drift_class_parser";
import { RelateDataRoutineGenerator } from "../../../generators/relate_data_routine_generator";

export class DataProviderRelateGenerator extends RelateDataRoutineGenerator {

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem, structure);
  }

  protected getRelatePath(featurePath: string, _entityName: string, _parser: DriftClassParser): string {
    // _entityName здесь будет именем промежуточной таблицы, например, "TaskTagMap"
    // this.intermediateSnake доступен из базового класса
    return path.join(this.projectStructure.getDataProvderPath(featurePath), this.intermediateSnake, `${this.intermediateSnake}_data_providers.dart`);
  }

  protected getRelateContent(_parser: DriftClassParser): string {
    // this.intermediateUpper, this.intermediateCamel, this.intermediateSnake
    // доступны из базового класса RelateDataRoutineGenerator.
    // _parser здесь передается, но его свойства уже извлечены в базовом классе.
    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../../core/database/local/provider/database_provider.dart';
import '../../../domain/repositories/${this.intermediateSnake}_repository.dart';
import '../../datasources/local/interfaces/${this.intermediateSnake}_local_datasource_service.dart';
import '../../datasources/local/sources/${this.intermediateSnake}_local_data_source.dart';
import '../../repositories/${this.intermediateSnake}_repository_impl.dart';

part '${this.intermediateSnake}_data_providers.g.dart';

@riverpod
I${this.intermediateUpper}LocalDataSource ${this.intermediateCamel}LocalDataSource(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return ${this.intermediateUpper}LocalDataSource(databaseService);
}

@riverpod
I${this.intermediateUpper}Repository ${this.intermediateCamel}Repository(Ref ref) {
  final localDataSource = ref.read(${this.intermediateCamel}LocalDataSourceProvider);
  return ${this.intermediateUpper}RepositoryImpl(localDataSource);
}
`;
  }
}
