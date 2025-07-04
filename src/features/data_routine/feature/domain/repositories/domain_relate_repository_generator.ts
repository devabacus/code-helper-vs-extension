import path from "path";
import { BaseGenerator } from "../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, unCap } from "../../../../../utils/text_work/text_util";
import { ServerpodModel } from "../../../serverpod_yaml_parser/formatters/types";

export class DomainRelateRepositoryGenerator extends BaseGenerator<ServerpodModel> {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainRepositoryPath(featurePath), `${(entityName)}_repository.dart`);
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
    const className = unCap(ClassName);
    const tableName = `${model.tableName}`;

    return `import '../../../../core/sync/sync_registry.dart';
import '../entities/${d2}/${d2}_entity.dart';
import '../entities/${d1}/${d1}_entity.dart';
import '../entities/${tableName}/${tableName}.dart';

abstract class I${ClassName}Repository implements ISyncableRepository {
  
  Stream<List<${ClassName}Entity>> watch${ClassNameS}();
  Future<String> create${ClassName}(${ClassName}Entity ${className});
  Future<bool> update${ClassName}(${ClassName}Entity ${className});
  Future<bool> delete${ClassName}(String id);
  Future<${ClassName}Entity?> get${ClassName}ById(String id, String customerId);
  Future<void> add${D2}To${D1}({required String ${d1}Id, required String ${d2}Id});
  Future<void> remove${D2}From${D1}({
    required String ${d1}Id,
    required String ${d2}Id,
  });
  Future<void> removeAll${D2s}From${D1}(String ${d1}Id);
  Future<List<${D2}Entity>> get${D2s}For${D1}(String ${d1}Id);
  Future<List<${D1}Entity>> get${D1s}For${D2}(String ${d2}Id);
}
`;
  }
}