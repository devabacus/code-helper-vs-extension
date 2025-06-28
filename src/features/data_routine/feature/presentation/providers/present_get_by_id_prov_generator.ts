import * as path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/types";

export class PresentGetByIdProviderGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getPresentationProviderPath(featurePath), entityName, `${entityName}_get_by_id_provider.dart`);
  }

  protected getContent(model: ServerpodModel): string {
      const D = model.className;
      const d = unCap(model.className);
    const ds = pluralConvert(d);

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${d}/${d}.dart';
import '../../../domain/providers/${d}/${d}_usecase_providers.dart';
import '${d}_state_providers.dart';

part '${d}_get_by_id_provider.g.dart';

@riverpod
Future<${D}Entity?> get${D}ById(Ref ref, String id) async {
  final ${ds}AsyncValue = ref.watch(${ds}StreamProvider);

  if (${ds}AsyncValue.hasValue) {
    final ${d} = ${ds}AsyncValue.value?.firstWhere(
      (cat) => cat.id == id,
      orElse: () => ${D}Entity(
        id: 'NOT_FOUND', 
        title: '', 
        lastModified: DateTime.now(), 
        userId: 0
      ), // Временный объект, если не найдено
    );
    // Если нашли реальный объект, возвращаем его
    if (${d} != null && ${d}.id != 'NOT_FOUND') {
      return ${d};
    }
  }
  
  // Если в кеше нет или кеш еще не загружен, делаем прямой запрос к базе
  final get${D}ByIdUseCase = ref.read(get${D}ByIdUseCaseProvider);
  
  // Проверяем, что use case доступен (пользователь авторизован)
  if (get${D}ByIdUseCase == null) {
    // Пользователь не авторизован
    return null;
  }
  
  final ${d}FromDb = await get${D}ByIdUseCase(id);
  return ${d}FromDb;
}
  `;
  }
}
