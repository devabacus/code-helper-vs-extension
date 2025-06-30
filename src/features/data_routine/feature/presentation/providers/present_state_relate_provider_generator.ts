import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import * as path from "path";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { cap, unCap, toSnakeCase, pluralConvert } from "../../../../../utils/text_work/text_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

/**
 * Generates Presentation layer (Riverpod Notifier) providers for a many-to-many relation table.
 */
export class PresentStateRelateProviderGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        // e.g., .../presentation/providers/task_tag_map/task_tag_map_relate_state_providers.dart
        return path.join(this.structure.getPresentationProviderPath(featurePath), toSnakeCase(entityName), `${toSnakeCase(entityName)}_relate_state_providers.dart`);
    }

    protected getContent(model: ServerpodModel): string {
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        const D1 = cap(sourceField.name); // Task
        const D2 = cap(targetField.name); // Tag
        const d1 = unCap(D1); // task
        const d2 = unCap(D2); // tag
        const D2s = pluralConvert(D2); // Tags
        
        const Rel = model.className; // TaskTagMap
        const relSnake = toSnakeCase(Rel); // task_tag_map
        
        const Entity2 = `${D2}Entity`;
        const idType = 'String';

        // Provider-нотификатор для управления списком связанных "целей" (D2) для одного "источника" (D1)
        const notifierName = `Related${D2s}For${D1}`;

        return `import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${d2}/${d2}.dart';
import '../../../domain/providers/${relSnake}/${relSnake}_relate_usecase_providers.dart';

part '${relSnake}_relate_state_providers.g.dart';

@riverpod
class ${notifierName} extends _$${notifierName} {
  @override
  Future<List<${Entity2}>> build(${idType} ${d1}Id) {
    // При первой загрузке получаем список связанных сущностей
    final useCase = ref.read(get${D2s}For${D1}UseCaseProvider);
    return useCase!(${d1}Id);
  }

  Future<void> add${D2}({required ${idType} ${d2}Id}) async {
    final ${d1}Id = arg; // Получаем ID "источника" из аргументов билда
    final useCase = ref.read(add${D2}To${D1}UseCaseProvider);
    
    // Оборачиваем в guard для обработки состояний загрузки/ошибки
    state = await AsyncValue.guard(() async {
      await useCase!(
        ${d1}Id: ${d1}Id,
        ${d2}Id: ${d2}Id,
      );
      // Перезагружаем данные, чтобы обновить UI
      return build(${d1}Id);
    });
  }

  Future<void> remove${D2}({required ${idType} ${d2}Id}) async {
    final ${d1}Id = arg;
    final useCase = ref.read(remove${D2}From${D1}UseCaseProvider);

    state = await AsyncValue.guard(() async {
      await useCase!(
        ${d1}Id: ${d1}Id,
        ${d2}Id: ${d2}Id,
      );
      return build(${d1}Id);
    });
  }

  Future<void> removeAll() async {
      final ${d1}Id = arg;
      final useCase = ref.read(removeAllRelationsFor${D1}UseCaseProvider);
      state = await AsyncValue.guard(() async {
          await useCase!(${d1}Id);
          return build(${d1}Id);
      });
  }
}
`;
    }
}