import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase, unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../interfaces/table_relation.interface";

export class DataProviderRelateGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    // entityName is intermediate table name like "taskTagMap"
    const snakeCaseEntityName = toSnakeCase(entityName);
    return path.join(this.structure.getDataProvderPath(featurePath), snakeCaseEntityName, `${snakeCaseEntityName}_data_providers.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const relations = tableParser.getTableRelations();
    const manyToManyRelation = relations.find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} to generate related data providers.`);
    }

    const intermediateUpper = parser.driftClassNameUpper; // e.g., TaskTagMap
    const intermediateLower = parser.driftClassNameLower; // e.g., taskTagMap
    const intermediateSnake = toSnakeCase(intermediateUpper); // e.g., task_tag_map

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../../core/database/local/provider/database_provider.dart';
import '../../../domain/repositories/${intermediateSnake}_repository.dart';
import '../../datasources/local/interfaces/${intermediateSnake}_local_datasource_service.dart';
import '../../datasources/local/sources/${intermediateSnake}_local_data_source.dart';
import '../../repositories/${intermediateSnake}_repository_impl.dart';

part '${intermediateSnake}_data_providers.g.dart';

@riverpod
I${intermediateUpper}LocalDataSource ${intermediateLower}LocalDataSource(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return ${intermediateUpper}LocalDataSource(databaseService);
}

@riverpod
I${intermediateUpper}Repository ${intermediateLower}Repository(Ref ref) {
  final localDataSource = ref.read(${intermediateLower}LocalDataSourceProvider);
  return ${intermediateUpper}RepositoryImpl(localDataSource);
}
`;
  }
}