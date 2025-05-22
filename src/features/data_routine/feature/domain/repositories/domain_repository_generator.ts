import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../core/interfaces/project_structure"; //
import { pluralConvert, cap } from "../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../generators/data_routine_generator"; //
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser"; //
import { Reference } from "../../../../../core/interfaces/drift_table_parser"; //
import { DriftTableParser } from "../../data/datasources/local/tables/drift_table_parser";

export class DomainRepositoryGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainRepositoryPath(featurePath), `${entityName}_repository.dart`); //
  }

  protected getContent(data: { classParser: DriftClassParser, tableParser: DriftTableParser }): string {
    const classParser = data.classParser;
    const tableParser = data.tableParser;

    if (!classParser) {
        console.error("DomainRepositoryGenerator: classParser не определен в 'data'.");
        return "// Ошибка: Не удалось получить classParser для генерации интерфейса репозитория.";
    }

    const d = classParser.driftClassNameLower;
    const D = classParser.driftClassNameUpper;
    const Ds = pluralConvert(D); //

    let foreignKeyMethodsSignatures = '';
    if (tableParser) { // Проверяем наличие tableParser
        const references: Reference[] = tableParser.getReferences(); //

        if (references && references.length > 0) {
            foreignKeyMethodsSignatures = references.map(ref => {
                const fkFieldName = ref.columnName;
                let methodNamePart = cap(fkFieldName); //
                if (methodNamePart.endsWith('Id')) {
                    methodNamePart = methodNamePart.slice(0, -2);
                }
                
                const fkFieldDetails = classParser.fields.find(f => f.name === fkFieldName); //
                const fkFieldType = fkFieldDetails ? fkFieldDetails.type : 'String';
                const paramNullableMarker = fkFieldDetails && fkFieldDetails.isNullable ? '?' : '';

                return `  Future<List<${D}Entity>> get${Ds}By${methodNamePart}Id(${fkFieldType}${paramNullableMarker} ${fkFieldName});`;
            }).join('\n');
        }
    }

    return `import '../entities/${d}/${d}.dart';

abstract class I${D}Repository {
  Future<List<${D}Entity>> get${Ds}();
  Stream<List<${D}Entity>> watch${Ds}();
  Future<${D}Entity> get${D}ById(String id);
  Future<String> create${D}(${D}Entity ${d});
  Future<bool> update${D}(${D}Entity ${d});
  Future<bool> delete${D}(String id);
${foreignKeyMethodsSignatures}
}
`;
  }
}