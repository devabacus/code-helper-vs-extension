import * as path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class PresentStateProviderGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getPresentationProviderPath(featurePath), entityName, `${entityName}_state_providers.dart`);
  }

  protected getContent(model: ServerpodModel): string {
    const D = model.className;
    const d = unCap(model.className);;
    const Ds = pluralConvert(D);
    const ds = pluralConvert(d);

    return `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/${d}/${d}_entity.dart';
import '../../../domain/providers/${d}/${d}_usecase_providers.dart';

part '${d}_state_providers.g.dart';

@riverpod
class ${Ds} extends _$${Ds} {
  @override
  Future<List<${D}Entity>> build() {
    return ref.read(get${Ds}UseCaseProvider)!();
  }

  Future<void> add${D}(${D}Entity ${d}) async {
    state = await AsyncValue.guard(() async {
      await ref.read(create${D}UseCaseProvider)!(${d});
      return ref.read(get${Ds}UseCaseProvider)!();
    });
  }

  Future<void> update${D}(${D}Entity ${d}) async {
    state = await AsyncValue.guard(() async {
      await ref.read(update${D}UseCaseProvider)!(${d});
      return ref.read(get${Ds}UseCaseProvider)!();
    });
  }

  Future<void> delete${D}(String id) async {
    state = await AsyncValue.guard(() async {
      await ref.read(delete${D}UseCaseProvider)!(id);
      return ref.read(get${Ds}UseCaseProvider)!();
    });
  }
}

@riverpod
Stream<List<${D}Entity>> ${ds}Stream(Ref ref) {
  final watchUseCase = ref.watch(watch${Ds}UseCaseProvider);
  
  if (watchUseCase == null) {
    return Stream.value(<${D}Entity>[]);
  }
  
  return watchUseCase();
}
  `;
  }
}
