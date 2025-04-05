import { BaseGenerator } from "../../../generators/base_generator";
import * as path from "path";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { pluralConvert } from "../../../../../utils/text_work/text_util";

export class PresentProviderGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getPresentationProviderPath(featurePath),  entityName, `${entityName}_state_providers.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const Ds = pluralConvert(D);
  
    return `
  import 'package:riverpod_annotation/riverpod_annotation.dart';
  import '../../../domain/entities/${d}/${d}.dart';
  import '../../../domain/providers/${d}/${d}_usecase_providers.dart';
  
  part '${d}_state_providers.g.dart';
  
  @riverpod
  class ${Ds} extends _$${Ds} {
    @override
    Future<List<${D}Entity>> build() {
      return ref.read(get${Ds}UseCaseProvider)();
    }
  
    Future<void> add${D}(${D}Entity ${d}) async {
      state = await AsyncValue.guard(() async {
        await ref.read(create${D}UseCaseProvider)(${d});
        return ref.read(get${Ds}UseCaseProvider)();
      });
    }
  
    Future<void> update${D}(${D}Entity ${d}) async {
      state = await AsyncValue.guard(() async {
        await ref.read(update${D}UseCaseProvider)(${d});
        return ref.read(get${Ds}UseCaseProvider)();
      });
    }
  
    Future<void> delete${D}(int id) async {
      state = await AsyncValue.guard(() async {
        await ref.read(delete${D}UseCaseProvider)(id);
        return ref.read(get${Ds}UseCaseProvider)();
      });
    }
  }
  `;
  }
}
