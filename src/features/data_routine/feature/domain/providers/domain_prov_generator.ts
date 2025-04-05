import { BaseGenerator } from "../../../generators/base_generator";
import * as path from "path";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { pluralConvert } from "../../../../../utils/text_work/text_util";

export class DomainProviderGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCaseProviderPath(featurePath), entityName, `${entityName}_usecase_providers.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const Ds = pluralConvert(D);
  
    return `
  import 'package:flutter_riverpod/flutter_riverpod.dart';
  import 'package:riverpod_annotation/riverpod_annotation.dart';
  import '../../usecases/${d}/create.dart';
  import '../../usecases/${d}/delete.dart';
  import '../../usecases/${d}/update.dart';
  import '../../usecases/${d}/get_all.dart';
  import '../../usecases/${d}/get_by_id.dart';
  import '../../../data/providers/${d}/${d}_data_providers.dart';
  
  part '${d}_usecase_providers.g.dart';
  
  @riverpod
  Get${Ds}UseCase get${Ds}UseCase(Ref ref) {
    final repository = ref.read(${d}RepositoryProvider);
    return Get${Ds}UseCase(repository);
  }
  
  @riverpod
  Create${D}UseCase create${D}UseCase(Ref ref) {
    final repository = ref.read(${d}RepositoryProvider);
    return Create${D}UseCase(repository);
  }
  
  @riverpod
  Delete${D}UseCase delete${D}UseCase(Ref ref) {
    final repository = ref.read(${d}RepositoryProvider);
    return Delete${D}UseCase(repository);
  }
  
  @riverpod
  Update${D}UseCase update${D}UseCase(Ref ref) {
    final repository = ref.read(${d}RepositoryProvider);
    return Update${D}UseCase(repository);
  }
  
  @riverpod
  Get${D}ByIdUseCase get${D}ByIdUseCase(Ref ref) {
    final repository = ref.read(${d}RepositoryProvider);
    return Get${D}ByIdUseCase(repository);
  }
  
  `;
  }
}

