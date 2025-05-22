import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../core/interfaces/project_structure"; //
import { pluralConvert, cap } from "../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../generators/data_routine_generator"; //
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser"; //
import { Reference } from "../../../../../core/interfaces/drift_table_parser"; //
import { DriftTableParser } from "../datasources/local/tables/drift_table_parser";

export class DataRepositoryGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataRepositoryPath(featurePath), `${entityName}_repository_impl.dart`); //
  }
  
  protected getContent(data: { classParser: DriftClassParser, tableParser: DriftTableParser }): string {
    const classParser = data.classParser;
    const tableParser = data.tableParser;

    if (!classParser) {
        console.error("DataRepositoryGenerator: classParser не определен в 'data'.");
        return "// Ошибка: Не удалось получить classParser для генерации реализации репозитория.";
    }

    const D = classParser.driftClassNameUpper;
    const d = classParser.driftClassNameLower;
    const Ds = pluralConvert(D); //

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
  Future<List<${D}Entity>> get${Ds}By${methodNamePart}Id(${fkFieldType}${paramNullableMarker} ${fkFieldName}) async {
    final ${d}Models = await _localDataSource.get${Ds}By${methodNamePart}Id(${fkFieldName});
    return ${d}Models.toEntities();
  }`;
            }).join('\n');
        }
    }

    return `import '../datasources/local/interfaces/${d}_local_datasource_service.dart';
import '../models/extensions/${d}_model_extension.dart';
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
  Stream<List<${D}Entity>> watch${Ds}() {
    return _localDataSource.watch${Ds}().map(
      (models) => models.toEntities(),
    );
  }

  @override
  Future<${D}Entity> get${D}ById(String id) async {
    final model = await _localDataSource.get${D}ById(id);
    return model.toEntity();
  }

  @override
  Future<String> create${D}(${D}Entity ${d}) {
    return _localDataSource.create${D}(${d}.toModel());
  }

  @override
  Future<bool> delete${D}(String id) async {
    return _localDataSource.delete${D}(id);
  }

  @override
  Future<bool> update${D}(${D}Entity ${d}) async {
    return _localDataSource.update${D}(${d}.toModel());
  }
${foreignKeyMethodsImplementations}
}
`;
  }

}