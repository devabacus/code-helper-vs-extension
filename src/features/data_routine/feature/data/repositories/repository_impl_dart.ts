import path from "path";
import { pluralConvert, unCap } from "../../../../../utils/text_work/text_util";
import { DriftClassParser } from "../datasources/local/tables/drift_class_parser";

export const repositoryImplPath = (fPath: string, driftClassName: string) => path.join(fPath, "data", "repositories", `${driftClassName}_repository_impl.dart`);

export const repositoryImplContent = (parser: DriftClassParser) => {
  const driftClassName = parser.driftClassName;
  const d = unCap(driftClassName);
  const D = driftClassName;
  const Ds = pluralConvert(D);
  const paramsDrift = parser.paramsInstDrift;
  const paramsModel = parser.paramsInstModel;


  return `
import '../../data/datasources/local/sources/${d}_local_data_source.dart';

import '../../domain/repositories/${d}_repository.dart';
import '../../domain/entities/${d}.dart';
import '../models/${d}_model.dart';

class ${D}RepositoryImpl implements ${D}Repository {
  final ${D}LocalDataSource _localDataSource;

  ${D}RepositoryImpl(this._localDataSource);
// ---------auto generated------------------//
  @override
  Future<List<${D}Entity>> get${Ds}() async {
    final ${d}Models = await _localDataSource.get${Ds}();
    return ${d}Models
        .map((model) => ${D}Entity(${paramsModel}))
        .toList();
  }

  @override
  Future<${D}Entity> get${D}ById(int id) async {
    final model = await _localDataSource.get${D}ById(id);
    return ${D}Entity(${paramsModel});
  }

  @override
  Future<int> create${D}(${D}Entity ${d}) {
    return _localDataSource.create${D}(
      ${D}Model(${paramsDrift}),
    );
  }

  @override
  Future<void> delete${D}(int id) async {
    _localDataSource.delete${D}(id);
  }

  @override
  Future<void> update${D}(${D}Entity ${d}) async {
    _localDataSource.update${D}(
      ${D}Model(${paramsDrift}),
    );
  }
    // ---------auto generated------------------//
    //custom methods
}
`;
};
