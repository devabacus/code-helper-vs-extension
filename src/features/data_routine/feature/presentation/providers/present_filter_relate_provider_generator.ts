import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import * as path from "path";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { cap, unCap, toSnakeCase, pluralConvert } from "../../../../../utils/text_work/text_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

/**
 * Generates a provider to filter and show "unassigned" entities.
 * (e.g., all Tags that are not yet assigned to a specific Task).
 * Updated to work with the new AsyncNotifier architecture.
 */
export class PresentFilterRelateProviderGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        const relSnake = toSnakeCase(entityName);
        // e.g., .../presentation/providers/task_tag_map/task_tag_map_filter_providers.dart
        return path.join(this.structure.getPresentationProviderPath(featurePath), relSnake, `${relSnake}_filter_providers.dart`);
    }

    protected getContent(model: ServerpodModel): string {
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        const D1 = cap(sourceField.name);   // Task
        const D2 = cap(targetField.name);   // Tag
        const d1 = unCap(D1);     // task
        const d2 = unCap(D2);     // tag
        const D2s = pluralConvert(D2); // Tags
        
        const Rel = model.className;      // TaskTagMap
        const relSnake = toSnakeCase(Rel); // task_tag_map

        const Entity2 = `${D2}Entity`;
        const idType = 'String';

        // Имя нашего нового провайдера-фильтра
        const providerName = `unassigned${D2s}For${D1}Provider`;
        // Провайдер, который дает ВСЕ цели (e.g., TagsProvider)
        const allTargetsProvider = `${pluralConvert(d2)}Provider`;
        // Наш новый нотификатор для УЖЕ ПРИВЯЗАННЫХ целей
        const relatedNotifierProvider = `related${D2s}For${D1}Provider`;

        return `import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${d2}/${d2}.dart';
import '../${d2}/${d2}_state_providers.dart';
import './${relSnake}_relate_state_providers.dart';

part '${relSnake}_filter_providers.g.dart';

@riverpod
Future<List<${Entity2}>> ${providerName}(${cap(providerName)}Ref ref, {required ${idType} ${d1}Id}) async {
  final allTargets = await ref.watch(${allTargetsProvider}.future);
  
  final assignedTargets = await ref.watch(${relatedNotifierProvider}(${d1}Id).future);
  
  final assignedIds = assignedTargets.map((e) => e.id).toSet();
  
  return allTargets.where((target) => !assignedIds.contains(target.id)).toList();
}
`;
    }
}