import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import * as path from "path";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { pluralConvert } from "../../../../../utils/text_work/text_util";

export class PresentGetByIdProviderGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getPresentationProviderPath(featurePath), entityName, `${entityName}_get_by_id_provider.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const ds = pluralConvert(d);

    return `import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../domain/entities/${d}/${d}.dart';
import '../../../domain/providers/${d}/${d}_usecase_providers.dart';
import '${d}_state_providers.dart';

part '${d}_get_by_id_provider.g.dart';

@riverpod
FutureOr<${D}Entity> get${D}ById(Ref ref, String id) async {
  final ${ds}AsyncValue = ref.read(${ds}Provider);

  if (${ds}AsyncValue is AsyncData<List<${D}Entity>>) {
    try {
      return ${ds}AsyncValue.value.firstWhere((cat) => cat.id == id);
    } catch (e) {
      print("Не нашли в кэше делаем запрос к базе, error: $e");
    }
  }
  final ${d} = await ref.read(get${D}ByIdUseCaseProvider)(id);
  if (${d} == null) {
    throw Exception('id = $id не найден');
  }
  return ${d};
}

  `;
  }
}
