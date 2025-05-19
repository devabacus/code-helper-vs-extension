import path from "path";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { RelateDataRoutineGenerator } from "../../../generators/relate_data_routine_generator";
import { toCamelCase, toPascalCase } from "../../../../../utils/text_work/text_util";

export class PresentFilterRelateProviderGenerator extends RelateDataRoutineGenerator {

  constructor(fileSystem: IFileSystem, projectStructure?: ProjectStructure) {
    super(fileSystem, projectStructure);
  }

  protected getRelatePath(featurePath: string, _entityName: string, _parser: DriftClassParser): string {
    // _entityName is the intermediate table name, e.g., "TaskTagMap"
    // this.useCaseSubDirSnake is `${this.sourceSnake}_${this.targetSnake}` (e.g., "task_tag")
    const fileName = `filter_${this.targetSnake}_for_${this.sourceSnake}_provider.dart`;
    return path.join(this.projectStructure.getPresentationProviderPath(featurePath), this.useCaseSubDirSnake, fileName);
  }

  protected getRelateContent(_parser: DriftClassParser): string {
    const providerName = `filtered${this.targetPlural}For${this.sourceUpper}`; // e.g., filteredTagsForTask
    const allTargetsProviderName = `${toCamelCase(this.targetPlural)}Provider`; // e.g., tagsProvider
    const sourceTargetsStateProviderName = `${this.sourceUpper}${this.targetPlural}Provider`; // e.g., TaskTagsProvider

    const fileNameWithoutExtension = `filter_${this.targetSnake}_for_${this.sourceSnake}_provider`;

    return `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${this.targetSnake}/${this.targetSnake}.dart';
import '../${this.targetSnake}/${this.targetSnake}_state_providers.dart'; 
import './${this.useCaseSubDirSnake}_state_providers.dart';

part '${fileNameWithoutExtension}.g.dart';

@riverpod
Future<List<${this.targetUpper}Entity>> ${providerName}(Ref ref, String? ${this.sourceForeignKey}) async {
  final all${this.targetPlural} = await ref.watch(${allTargetsProviderName}.future);
  
  if (${this.sourceForeignKey} == null) {
    return all${this.targetPlural};
  }
  
  final assigned${this.targetPlural} = await ref.watch(${sourceTargetsStateProviderName}(${this.sourceForeignKey}: ${this.sourceForeignKey}).future);
  
  return all${this.targetPlural}.where((${this.targetSnake}) {
    return !assigned${this.targetPlural}.any((assigned${this.targetUpper}) => assigned${this.targetUpper}.id == ${this.targetSnake}.id);
  }).toList();
}
`;
  }
}