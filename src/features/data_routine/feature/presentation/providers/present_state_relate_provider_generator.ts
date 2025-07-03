import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import * as path from "path";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { cap, unCap, toSnakeCase, pluralConvert } from "../../../../../utils/text_work/text_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class PresentStateRelateProviderGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getPresentationProviderPath(featurePath), entityName, `${entityName}_state_providers.dart`);
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

            return `import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${d2}/${d2}.dart';
import '../../../domain/providers/${tableName}/${tableName}_usecase_providers.dart';

part '${tableName}_state_providers.g.dart';

@riverpod
class Related${D2s}For${D1} extends _$Related${D2s}For${D1} {
  @override
  Future<List<${D2}Entity>> build(String ${d1}Id) {
    final useCase = ref.read(get${D2s}For${D1}UseCaseProvider);
    // Проверяем, что use case доступен (пользователь авторизован)
    if (useCase == null) return Future.value([]);
    return useCase(${d1}Id);
  }

  Future<void> add${D2}({required String ${d2}Id}) async {
    final useCase = ref.read(add${D2}To${D1}UseCaseProvider);
    if (useCase == null) return;
    
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await useCase(
        ${d1}Id: ${d1}Id,
        ${d2}Id: ${d2}Id,
      );
      // Перезагружаем данные, чтобы обновить UI
      return build(${d1}Id);
    });
  }

  Future<void> remove${D2}({required String ${d2}Id}) async {
    final useCase = ref.read(remove${D2}From${D1}UseCaseProvider);
    if (useCase == null) return;

    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {    
      await useCase(
        ${d1}Id: ${d1}Id,
        ${d2}Id: ${d2}Id,
      );
      return build(${d1}Id);
    });
  }
}
`;
    }
}