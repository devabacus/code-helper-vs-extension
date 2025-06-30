import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import * as path from "path";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { cap, unCap, toSnakeCase, pluralConvert } from "../../../../../utils/text_work/text_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

/**
 * Generates Presentation layer (Riverpod Notifier) providers for a many-to-many relation table.
 * FINAL CORRECTED VERSION: Uses modern Riverpod Generator syntax.
 */
export class PresentStateRelateProviderGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        const relSnake = toSnakeCase(entityName);
        return path.join(this.structure.getPresentationProviderPath(featurePath), relSnake, `${relSnake}_relate_state_providers.dart`);
    }

    protected getContent(model: ServerpodModel): string {
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        const D1 = cap(sourceField.name);   // Task
        const D2 = cap(targetField.name);   // Tag
        const d1 = unCap(D1);     // task
        
        const D2s = pluralConvert(D2); // Tags
        
        const Rel = model.className;      // TaskTagMap
        const relSnake = toSnakeCase(Rel); // task_tag_map
        
        const Entity2 = `${D2}Entity`;
        const idType = 'String';

        const notifierName = `Related${D2s}For${D1}`;
        const argName = `${d1}Id`; // Имя аргумента, e.g., taskId

        return `import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${unCap(D2)}/${unCap(D2)}.dart';
import '../../../domain/providers/${relSnake}/${relSnake}_relate_usecase_providers.dart';

part '${relSnake}_relate_state_providers.g.dart';

@riverpod
class ${notifierName} extends _$${notifierName} {
  @override
  Future<List<${Entity2}>> build(${idType} ${argName}) {
    final useCase = ref.read(get${D2s}For${D1}UseCaseProvider);
    // Проверяем, что use case доступен (пользователь авторизован)
    if (useCase == null) return Future.value([]);
    return useCase(${argName});
  }

  Future<void> add${D2}({required ${idType} ${unCap(D2)}Id}) async {
    final useCase = ref.read(add${D2}To${D1}UseCaseProvider);
    if (useCase == null) return;
    
    state = await AsyncValue.guard(() async {
      await useCase(
        ${d1}Id: this.${argName}, // --- ИСПРАВЛЕНО: используем поле класса ---
        ${unCap(D2)}Id: ${unCap(D2)}Id,
      );
      // Перезагружаем данные, чтобы обновить UI
      return build(this.${argName});
    });
  }

  Future<void> remove${D2}({required ${idType} ${unCap(D2)}Id}) async {
    final useCase = ref.read(remove${D2}From${D1}UseCaseProvider);
    if (useCase == null) return;

    state = await AsyncValue.guard(() async {
      await useCase(
        ${d1}Id: this.${argName}, // --- ИСПРАВЛЕНО ---
        ${unCap(D2)}Id: ${unCap(D2)}Id,
      );
      return build(this.${argName});
    });
  }

  Future<void> removeAll() async {
      final useCase = ref.read(removeAllRelationsFor${D1}UseCaseProvider);
      if (useCase == null) return;

      state = await AsyncValue.guard(() async {
          await useCase(this.${argName}); // --- ИСПРАВЛЕНО ---
          return build(this.${argName});
      });
  }
}
`;
    }
}