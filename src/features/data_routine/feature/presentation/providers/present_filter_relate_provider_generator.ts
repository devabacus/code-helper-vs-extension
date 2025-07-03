import * as path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, pluralConvert } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class PresentFilterRelateProviderGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getPresentationProviderPath(featurePath), entityName, `${entityName}_filter_providers.dart`);
    }

    protected getContent(model: ServerpodModel): string {
        const d1 = model.fields[1].relatedModel!;
    const d2 = model.fields[2].relatedModel!;       

    const D1 = cap(d1);
    const D1s = pluralConvert(D1);
    const D2 = cap(d2);
    const D2s = pluralConvert(D2);
    const ClassName = `${model.className}`; 
    const ClassNameS = pluralConvert(ClassName); 
    const tableName = `${model.tableName}`; 

            return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${d2}/${d2}.dart';
import '../${d2}/${d2}_state_providers.dart';
import './${tableName}_state_providers.dart';

part '${tableName}_filter_providers.g.dart';

@riverpod
Future<List<${D2}Entity>> unassigned${D2s}For${D1}Provider(Ref ref, {required String taskId}) async {
  final allTargets = await ref.watch(${d2}sProvider.future);
  
  final assignedTargets = await ref.watch(related${D2s}For${D1}Provider(taskId).future);
  
  final assignedIds = assignedTargets.map((e) => e.id).toSet();
  
  return allTargets.where((target) => !assignedIds.contains(target.id)).toList();
}

`;
    }
}