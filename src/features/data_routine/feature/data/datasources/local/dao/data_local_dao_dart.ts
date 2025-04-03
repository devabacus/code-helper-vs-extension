import path from "path";
import { cap, pluralConvert } from "@utils";


export const daoPath = (fName: string, driftClassName: string) => path.join(fName, "data", "datasources", "local", "dao", `${driftClassName}_dao.dart`);

export const daoLocalContent = (driftClassName: string) => {
    const d = driftClassName;
    const D = cap(driftClassName);
    const Ds = pluralConvert(D);

    return `
import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/database.dart';
import '../tables/${d}_table.dart';

part '${d}_dao.g.dart';

@DriftAccessor(tables: [${D}Table])
class ${D}Dao extends DatabaseAccessor<AppDatabase> with _$${D}DaoMixin {
  ${D}Dao(super.db);

  Future<List<${D}TableData>> get${Ds}() => select(${d}Table).get();
  
  Future<${D}TableData> get${D}ById(int id) => 
      (select(${d}Table)..where((t) => t.id.equals(id)))
      .getSingle();
  
  Future<int> create${D}(${D}TableCompanion ${d}) =>
      into(${d}Table).insert(${d});
  
  Future<void> update${D}(${D}TableCompanion ${d}) =>
      update(${d}Table).replace(${d});
  
  Future<void> delete${D}(int id) =>
      (delete(${d}Table)..where((t) => t.id.equals(id))).go();
}

`;
};
