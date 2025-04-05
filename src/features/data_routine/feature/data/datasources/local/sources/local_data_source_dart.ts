import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { pluralConvert } from "../../../../../../../utils/text_work/text_util";
import { BaseGenerator } from "../../../../../generators/base_generator";
import { DriftClassParser } from "../tables/drift_class_parser";


export class DataSourcesGenerator extends BaseGenerator {

  private structure: ProjectStructure;


  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getLocalDataSourcePath(featurePath), `${entityName}_local_data_source.dart`);
  }
  protected getContent(parser: DriftClassParser): string {
    const D = parser.driftClassNameUpper;
    const d = parser.driftClassNameLower;
    const Ds = pluralConvert(D);
    const ds = pluralConvert(d);
    const paramsDrift = parser.paramsInstDrift;
    const paramsDriftWithOutId = parser.paramsWithOutId(paramsDrift);
    const valueWrap = parser.paramsWrapValue;
      
  
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
  }

}

