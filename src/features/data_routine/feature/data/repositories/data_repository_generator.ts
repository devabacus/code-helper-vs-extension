
import path from "path";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { IDriftClassParser } from "../datasources/local/tables/drift_class_parser";
import { pluralConvert } from "../../../../../utils/text_work/text_util";


export class DataRepositoryGenerator extends DataRoutineGenerator {

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(featurePath, "data", "repositories", `${entityName}_repository_impl.dart`);
  }
  protected getContent(parser: IDriftClassParser): string {
    const D = parser.driftClassNameUpper;
    const d = parser.driftClassNameLower;
    const Ds = pluralConvert(D);

    return `import '../datasources/local/interfaces/${d}_local_datasource_service.dart';
import '../models/extensions/${d}_model_extension.dart';
import '../models/${d}/${d}_model.dart';
import '../../domain/entities/extensions/${d}_entity_extension.dart';
import '../../domain/entities/${d}/${d}.dart';
import '../../domain/repositories/${d}_repository.dart';

class ${D}RepositoryImpl implements I${D}Repository {
  final I${D}LocalDataSource _localDataSource;

  ${D}RepositoryImpl(this._localDataSource);
  
  @override
  Future<List<${D}Entity>> get${Ds}() async {
    final ${d}Models = await _localDataSource.get${Ds}();
    return ${d}Models.toEntities();
  }

  @override
  Future<${D}Entity> get${D}ById(int id) async {
    final model = await _localDataSource.get${D}ById(id);
    return model.toEntity();
  }

  @override
  Future<int> create${D}(${D}Entity ${d}) {
    return _localDataSource.create${D}(${d}.toModel());
  }

  @override
  Future<void> delete${D}(int id) async {
    _localDataSource.delete${D}(id);
  }

  @override
  Future<void> update${D}(${D}Entity ${d}) async {
    _localDataSource.update${D}(
      ${D}Model(id: ${d}.id, title: ${d}.title),
    );
  }
}

`;
  }

}
