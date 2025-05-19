import path from "path";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { toCamelCase } from "../../../../../utils/text_work/text_util";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { RelateDataRoutineGenerator } from "../../../generators/relate_data_routine_generator";

export class UseCaseRelateProvidersGenerator extends RelateDataRoutineGenerator {

  constructor(fileSystem: IFileSystem, projectStructure?: ProjectStructure) {
    super(fileSystem, projectStructure);
  }

  protected getRelatePath(featurePath: string, _entityName: string, _parser: DriftClassParser): string {
    // Файл провайдеров именуется по промежуточной таблице (this.intermediateSnake)
    // _entityName здесь будет именем промежуточной таблицы, например, "TaskTagMap"
    return path.join(this.projectStructure.getDomainUseCaseProviderPath(featurePath), this.intermediateSnake, `${this.intermediateSnake}_usecase_providers.dart`);
  }

  protected getRelateContent(_parser: DriftClassParser): string {
    // Все необходимые свойства (this.intermediateSnake, this.sourceUpper, this.targetUpper,
    // this.targetPlural, this.useCaseSubDirSnake, this.sourcePluralSnake и т.д.) доступны из базового класса.

    // Имена классов UseCase
    const addUseCaseClass = `Add${this.targetUpper}To${this.sourceUpper}UseCase`;
    const getTargetsUseCaseClass = `Get${this.targetPlural}For${this.sourceUpper}UseCase`;
    const getSourcesUseCaseClass = `Get${this.sourcePlural}With${this.targetUpper}UseCase`;
    const removeTargetUseCaseClass = `Remove${this.targetUpper}From${this.sourceUpper}UseCase`;
    const removeAllTargetsUseCaseClass = `RemoveAll${this.targetPlural}From${this.sourceUpper}UseCase`;

    // Имена файлов UseCase (для импортов)
    const addUseCaseFile = `add_${this.targetSnake}_to_${this.sourceSnake}.dart`;
    const getTargetsUseCaseFile = `get_${this.targetPluralSnake}_for_${this.sourceSnake}.dart`;
    const getSourcesUseCaseFile = `get_${this.sourcePluralSnake}_with_${this.targetSnake}.dart`;
    const removeTargetUseCaseFile = `remove_${this.targetSnake}_from_${this.sourceSnake}.dart`;
    const removeAllTargetsUseCaseFile = `remove_all_${this.targetPluralSnake}_from_${this.sourceSnake}.dart`;

    return `import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/providers/${this.intermediateSnake}/${this.intermediateSnake}_data_providers.dart';
import '../../usecases/${this.useCaseSubDirSnake}/${addUseCaseFile}';
import '../../usecases/${this.useCaseSubDirSnake}/${getTargetsUseCaseFile}';
import '../../usecases/${this.useCaseSubDirSnake}/${getSourcesUseCaseFile}';
import '../../usecases/${this.useCaseSubDirSnake}/${removeAllTargetsUseCaseFile}';
import '../../usecases/${this.useCaseSubDirSnake}/${removeTargetUseCaseFile}';

part '${this.intermediateSnake}_usecase_providers.g.dart';

@riverpod
${addUseCaseClass} ${toCamelCase(addUseCaseClass)} (Ref ref) {
  final repository = ref.read(${this.intermediateCamel}RepositoryProvider);
  return ${addUseCaseClass}(repository);
}

@riverpod
${getTargetsUseCaseClass} ${toCamelCase(getTargetsUseCaseClass)}(Ref ref) {
  final repository = ref.read(${this.intermediateCamel}RepositoryProvider);
  return ${getTargetsUseCaseClass}(repository);
}

@riverpod
${getSourcesUseCaseClass} ${toCamelCase(getSourcesUseCaseClass)}(Ref ref) {
  final repository = ref.read(${this.intermediateCamel}RepositoryProvider);
  return ${getSourcesUseCaseClass}(repository);
}

@riverpod
${removeTargetUseCaseClass} ${toCamelCase(removeTargetUseCaseClass)}(Ref ref) {
  final repository = ref.read(${this.intermediateCamel}RepositoryProvider);
  return ${removeTargetUseCaseClass}(repository);
}

@riverpod
${removeAllTargetsUseCaseClass} ${toCamelCase(removeAllTargetsUseCaseClass)}(Ref ref) {
  final repository = ref.read(${this.intermediateCamel}RepositoryProvider);
  return ${removeAllTargetsUseCaseClass}(repository);
}
`;
  }
}
