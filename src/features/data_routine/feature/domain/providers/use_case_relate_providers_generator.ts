import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, toCamelCase, pluralConvert, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../data/datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../interfaces/table_relation.interface";

export class UseCaseRelateProvidersGenerator extends DataRoutineGenerator {

  private projectStructure: ProjectStructure;

  constructor(fileSystem: IFileSystem, projectStructure?: ProjectStructure) {
    super(fileSystem);
    this.projectStructure = projectStructure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    // entityName here is expected to be the "relation name" like "TaskTag"
    const relationSnake = toSnakeCase(entityName); // e.g., task_tag
    return path.join(this.projectStructure.getDomainUseCaseProviderPath(featurePath), relationSnake, `${relationSnake}_usecase_providers.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    // parser is for the intermediate table, e.g., TaskTagMap
    const intermediateUpper = parser.driftClassNameUpper; // TaskTagMap
    const intermediateCamel = toCamelCase(intermediateUpper); // taskTagMap
    const intermediateSnake = toSnakeCase(intermediateUpper); // task_tag_map

    const tableParser = new DriftTableParser(parser.driftClass);
    const manyToManyRelation = tableParser.getTableRelations().find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${intermediateUpper} to generate 'relate use case providers'.`);
    }

    const sourceTable = manyToManyRelation.sourceTable; // e.g., task
    const targetTable = manyToManyRelation.targetTable; // e.g., tag

    const sourceUpper = cap(sourceTable); // Task
    const targetUpper = cap(targetTable); // Tag
    const sourceSnake = toSnakeCase(sourceTable); // task
    const targetSnake = toSnakeCase(targetTable); // tag

    const targetPlural = pluralConvert(targetUpper); // Tags
    const targetPluralSnake = toSnakeCase(targetPlural); // tags

    // This relationSnake is used for the 'part' directive and use case import paths, matching the example
    const relationSnake = `${sourceSnake}_${targetSnake}`; // e.g., task_tag

    // Use case class names
    const addUseCaseClass = `Add${targetUpper}To${sourceUpper}UseCase`;
    const getTargetsUseCaseClass = `Get${targetPlural}For${sourceUpper}UseCase`;
    const getSourcesUseCaseClass = `Get${sourceUpper}With${targetUpper}UseCase`; // As per GetTaskWithTagUseCase in example
    const removeTargetUseCaseClass = `Remove${targetUpper}From${sourceUpper}UseCase`;
    const removeAllTargetsUseCaseClass = `RemoveAll${targetPlural}From${sourceUpper}UseCase`;

    // Descriptive file names for use cases as per example
    const addUseCaseFile = `add_${targetSnake}_to_${sourceSnake}.dart`;
    const getTargetsUseCaseFile = `get_${targetPluralSnake}_for_${sourceSnake}.dart`;
    const getSourcesUseCaseFile = `get_${sourceSnake}_with_${targetSnake}.dart`;
    const removeTargetUseCaseFile = `remove_${targetSnake}_from_${sourceSnake}.dart`;
    const removeAllTargetsUseCaseFile = `remove_all_${targetPluralSnake}_from_${sourceSnake}.dart`;

    return `import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/providers/${intermediateSnake}/${intermediateSnake}_data_providers.dart';
import '../../usecases/${relationSnake}/${addUseCaseFile}';
import '../../usecases/${relationSnake}/${getTargetsUseCaseFile}';
import '../../usecases/${relationSnake}/${getSourcesUseCaseFile}';
import '../../usecases/${relationSnake}/${removeAllTargetsUseCaseFile}';
import '../../usecases/${relationSnake}/${removeTargetUseCaseFile}';

part '${relationSnake}_usecase_providers.g.dart';

@riverpod
${addUseCaseClass} ${toCamelCase(addUseCaseClass)} (Ref ref) {
  final repository = ref.read(${intermediateCamel}RepositoryProvider);
  return ${addUseCaseClass}(repository);
}

@riverpod
${getTargetsUseCaseClass} ${toCamelCase(getTargetsUseCaseClass)}(Ref ref) {
  final repository = ref.read(${intermediateCamel}RepositoryProvider);
  return ${getTargetsUseCaseClass}(repository);
}

@riverpod
${getSourcesUseCaseClass} ${toCamelCase(getSourcesUseCaseClass)}(Ref ref) {
  final repository = ref.read(${intermediateCamel}RepositoryProvider);
  return ${getSourcesUseCaseClass}(repository);
}

@riverpod
${removeTargetUseCaseClass} ${toCamelCase(removeTargetUseCaseClass)}(Ref ref) {
  final repository = ref.read(${intermediateCamel}RepositoryProvider);
  return ${removeTargetUseCaseClass}(repository);
}

@riverpod
${removeAllTargetsUseCaseClass} ${toCamelCase(removeAllTargetsUseCaseClass)}(Ref ref) {
  final repository = ref.read(${intermediateCamel}RepositoryProvider);
  return ${removeAllTargetsUseCaseClass}(repository);
}
`;
  }
}