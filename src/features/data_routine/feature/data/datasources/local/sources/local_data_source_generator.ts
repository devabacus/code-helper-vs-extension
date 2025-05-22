import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure"; //
import { pluralConvert, cap } from "../../../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator"; //
import { DriftClassParser } from "../tables/drift_class_parser"; //
import { Reference } from "../../../../../../../core/interfaces/drift_table_parser"; //
import { DriftTableParser } from "../tables/drift_table_parser";

export class DataSourcesGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getLocalDataSourcePath(featurePath), `${entityName}_local_data_source.dart`); //
  }

  protected getContent(data: { classParser: DriftClassParser, tableParser: DriftTableParser }): string {
    const classParser = data.classParser;
    const tableParser = data.tableParser;

    if (!classParser) {
        console.error("DataSourcesGenerator: classParser не определен в 'data'.");
        return "// Ошибка: Не удалось получить classParser для генерации DataSource.";
    }

    const D = classParser.driftClassNameUpper;
    const d = classParser.driftClassNameLower;
    const ds = pluralConvert(d); // используется в именах переменных, например list of items
    const Ds = pluralConvert(D); // используется в именах методов, например getItems

    let foreignKeyMethodsImplementations = '';
    if (tableParser) { // Проверяем наличие tableParser
        const references: Reference[] = tableParser.getReferences(); //

        if (references && references.length > 0) {
            foreignKeyMethodsImplementations = references.map(ref => {
                const fkFieldName = ref.columnName;
                let methodNamePart = cap(fkFieldName); //
                if (methodNamePart.endsWith('Id')) {
                    methodNamePart = methodNamePart.slice(0, -2);
                }
                
                const fkFieldDetails = classParser.fields.find(f => f.name === fkFieldName); //
                const fkFieldType = fkFieldDetails ? fkFieldDetails.type : 'String';
                const paramNullableMarker = fkFieldDetails && fkFieldDetails.isNullable ? '?' : '';

                return `
  @override
  Future<List<${D}Model>> get${Ds}By${methodNamePart}Id(${fkFieldType}${paramNullableMarker} ${fkFieldName}) async {
    final ${ds}Data = await ${d}Dao.get${Ds}By${methodNamePart}Id(${fkFieldName});
    return ${ds}Data.toModels();
  }`;
            }).join('\n');
        }
    } else {
        // console.warn(`DataSourcesGenerator: tableParser не был предоставлен для сущности ${D}. Методы по внешним ключам не будут сгенерированы в реализации DataSource.`);
    }

    return `import '../../../models/extensions/${d}_model_extension.dart';
import '../../../datasources/local/tables/extensions/${d}_table_extension.dart';
import '../../../models/${d}/${d}_model.dart';
import '../dao/${d}/${d}_dao.dart';
import '../interfaces/${d}_local_datasource_service.dart';

class ${D}LocalDataSource implements I${D}LocalDataSource {
  final ${D}Dao ${d}Dao;

  ${D}LocalDataSource(this.${d}Dao);

  @override
  Future<List<${D}Model>> get${Ds}() async {
    final ${ds} = await ${d}Dao.get${Ds}();
    return ${ds}.toModels();
  }

  @override
  Stream<List<${D}Model>> watch${Ds}() {
    return ${d}Dao.watch${Ds}().map((list) => list.toModels());
  }

  @override
  Future<${D}Model> get${D}ById(String id) async {
    final ${d} = await ${d}Dao.get${D}ById(id);
    return ${d}.toModel();
  }

  @override
  Future<String> create${D}(${D}Model ${d}) {
    return ${d}Dao.create${D}(${d}.toCompanion());
  }

  @override
  Future<bool> update${D}(${D}Model ${d}) {
    return ${d}Dao.update${D}(${d}.toCompanionWithId());
  }

  @override
  Future<bool> delete${D}(String id) async {
    return ${d}Dao.delete${D}(id);
  }
${foreignKeyMethodsImplementations}
}

  `;
  }

}