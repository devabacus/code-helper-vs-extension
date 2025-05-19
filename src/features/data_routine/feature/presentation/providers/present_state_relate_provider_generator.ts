import path from "path";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { RelateDataRoutineGenerator } from "../../../generators/relate_data_routine_generator";
import { toCamelCase } from "../../../../../utils/text_work/text_util";

export class PresentStateRelateProviderGenerator extends RelateDataRoutineGenerator {

  constructor(fileSystem: IFileSystem, projectStructure?: ProjectStructure) {
    super(fileSystem, projectStructure);
  }

  protected getRelatePath(featurePath: string, _entityName: string, _parser: DriftClassParser): string {
    // _entityName is the intermediate table name, e.g., "TaskTagMap"
    // this.useCaseSubDirSnake is `${this.sourceSnake}_${this.targetSnake}` (e.g., "task_tag")
    const fileName = `${this.useCaseSubDirSnake}_state_providers.dart`;
    return path.join(this.projectStructure.getPresentationProviderPath(featurePath), this.useCaseSubDirSnake, fileName);
  }

  protected getRelateContent(_parser: DriftClassParser): string {
    // Properties like this.sourceUpper, this.targetUpper, this.targetPlural, etc. are available from the base class.
    // this.intermediateSnake is also available for imports.

    const class1Name = `${this.sourceUpper}${this.targetPlural}`; // e.g., TaskTags
    const class2Name = `${this.sourcePlural}With${this.targetUpper}`; // e.g., TasksWithTag

    // Use case provider names (derived from use case class names)
    const getTargetsForSourceUseCaseProvider = `${toCamelCase(`Get${this.targetPlural}For${this.sourceUpper}UseCase`)}Provider`;
    const addTargetToSourceUseCaseProvider = `${toCamelCase(`Add${this.targetUpper}To${this.sourceUpper}UseCase`)}Provider`;
    const removeTargetFromSourceUseCaseProvider = `${toCamelCase(`Remove${this.targetUpper}From${this.sourceUpper}UseCase`)}Provider`;
    const removeAllTargetsFromSourceUseCaseProvider = `${toCamelCase(`RemoveAll${this.targetPlural}From${this.sourceUpper}UseCase`)}Provider`;
    const getSourcesWithTargetUseCaseProvider = `${toCamelCase(`Get${this.sourcePlural}With${this.targetUpper}UseCase`)}Provider`;

    const fileNameWithoutExtension = `${this.useCaseSubDirSnake}_state_providers`;

    return `
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${this.targetSnake}/${this.targetSnake}.dart';
import '../../../domain/entities/${this.sourceSnake}/${this.sourceSnake}.dart';
import '../../../domain/providers/${this.intermediateSnake}/${this.intermediateSnake}_usecase_providers.dart';

part '${fileNameWithoutExtension}.g.dart';

@riverpod
class ${class1Name} extends _$${class1Name} {
  @override
  Future<List<${this.targetUpper}Entity>> build({required String ${this.sourceForeignKey}}) {
    ref.keepAlive();
    return ref.read(${getTargetsForSourceUseCaseProvider})(${this.sourceForeignKey});
  }

  Future<void> add${this.targetUpper}To${this.sourceUpper}(String ${this.sourceForeignKey}, String ${this.targetForeignKey}) async {
    state = await AsyncValue.guard(() async {
      await ref.read(${addTargetToSourceUseCaseProvider})(${this.sourceForeignKey}, ${this.targetForeignKey});
      return ref.read(${getTargetsForSourceUseCaseProvider})(${this.sourceForeignKey});
    });
  }

  Future<void> remove${this.targetUpper}From${this.sourceUpper}(String ${this.sourceForeignKey}, String ${this.targetForeignKey}) async {
    state = await AsyncValue.guard(() async {
      await ref.read(${removeTargetFromSourceUseCaseProvider})(${this.sourceForeignKey}, ${this.targetForeignKey});
      return ref.read(${getTargetsForSourceUseCaseProvider})(${this.sourceForeignKey});
    });
  }

  Future<void> removeAll${this.targetPlural}From${this.sourceUpper}(String ${this.sourceForeignKey}) async {
    state = await AsyncValue.guard(() async {
      await ref.read(${removeAllTargetsFromSourceUseCaseProvider})(${this.sourceForeignKey});
      return ref.read(${getTargetsForSourceUseCaseProvider})(${this.sourceForeignKey});
    });
  }
}

@riverpod
class ${class2Name} extends _$${class2Name} {
  @override
  Future<List<${this.sourceUpper}Entity>> build({required String ${this.targetForeignKey}}) {
    return ref.read(${getSourcesWithTargetUseCaseProvider})(${this.targetForeignKey});
  }
}
`;
  }
}