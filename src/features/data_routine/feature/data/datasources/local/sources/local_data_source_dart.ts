import path from "path";
import { DriftClassParser } from "../tables/drift_class_parser";
import { cap, pluralConvert, unCap } from "../../../../../../../utils/text_work/text_util";

export const localDataSourcePath = (fPath: string, driftClassName: string) => path.join(fPath, "data", "datasources", "local", "sources", `${driftClassName}_local_data_source.dart`);


export const localDataSourceCont = (parser: DriftClassParser) => {
  const driftClassName = parser.driftClassName;
  const d = unCap(driftClassName);
  const D = driftClassName;
  const Ds = pluralConvert(D);
  const ds = pluralConvert(d);
  const paramsDrift = parser.paramsInstDrift;
  const paramsDriftWithOutId = parser.paramsWithOutId(paramsDrift);
  const valueWrap = parser.paramWrapValue;


  return `
import '../../../../../../core/database/local/database.dart';
import '../../local/dao/${d}_dao.dart';
import '../../../../data/models/${d}_model.dart';
import 'package:drift/drift.dart';

class ${D}LocalDataSource {
  final ${D}Dao _${d}Dao;

  ${D}LocalDataSource(AppDatabase db) : _${d}Dao = ${D}Dao(db);

  Future<List<${D}Model>> get${Ds}() async {
    final ${ds} = await _${d}Dao.get${Ds}();
    return ${ds}
        .map(
          (${d}) => ${D}Model(${paramsDrift}),
        )
        .toList();
  }

  Future<${D}Model> get${D}ById(int id) async {
    final ${d} = await _${d}Dao.get${D}ById(id);
    return ${D}Model(${paramsDrift});
  }

  Future<int> create${D}(${D}Model ${d}) {
    return _${d}Dao.create${D}(
      ${D}TableCompanion.insert(${paramsDriftWithOutId}),
    );
  }

  Future<void> update${D}(${D}Model ${d}) {
    return _${d}Dao.update${D}(
      ${D}TableCompanion(${valueWrap}),
    );
  }

  Future<void> delete${D}(int id) async {
      _${d}Dao.delete${D}(id);
    }

}
`;
};
// getCategories: id: ${d}.id, title: ${d}.title
// get${D}ById: -//- -//-
// create: без id -//- -//-
// update${D}: id: Value(${d}.id) , title: Value(${d}.title)