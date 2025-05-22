import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
// import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, cap, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { Reference } from "../../../../../core/interfaces/drift_table_parser";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../data/datasources/local/tables/drift_table_parser";

export class UseCaseGetByForeignKeyGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  // Этот генератор будет создавать несколько файлов (по одному на каждый внешний ключ)
  // поэтому стандартный getPath/getContent не совсем подходит в чистом виде.
  // Вместо этого, основной метод generate будет итерировать по внешним ключам
  // и для каждого создавать файл.

  protected getPath(featurePath: string, entityName: string, fkDetails?: { fkFieldName: string, methodNamePart: string }): string {
    if (!fkDetails) {
        // Этот путь не должен использоваться напрямую без деталей о внешнем ключе
        return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, `get_${entityName}_by_foreign_key_base.dart`);
    }
    // entityName здесь - имя основной сущности (например, "task")
    // fkDetails.methodNamePart - часть имени, относящаяся к внешнему ключу (например, "Category")
    // fkDetails.fkFieldName - имя поля внешнего ключа (например, "categoryId")
    const useCaseFileName = `get_${pluralConvert(entityName)}_by_${toSnakeCase(fkDetails.methodNamePart)}_id.dart`;
    return path.join(this.structure.getDomainUseCasesPath(featurePath), entityName, useCaseFileName); //
  }

  protected getContent(data: { classParser: DriftClassParser, fkReference: Reference }): string {
    const classParser = data.classParser;
    const ref = data.fkReference;

    const d = classParser.driftClassNameLower; // task
    const D = classParser.driftClassNameUpper; // Task
    const Ds = pluralConvert(D); // Tasks

    const fkFieldName = ref.columnName; // categoryId
    let methodNamePart = cap(fkFieldName); // CategoryId
    if (methodNamePart.endsWith('Id')) {
        methodNamePart = methodNamePart.slice(0, -2); // Category
    }
    
    const fkFieldDetails = classParser.fields.find(f => f.name === fkFieldName);
    const fkFieldType = fkFieldDetails ? fkFieldDetails.type : 'String';
    const paramNullableMarker = fkFieldDetails && fkFieldDetails.isNullable ? '?' : '';
    
    const useCaseClassName = `Get${Ds}By${methodNamePart}IdUseCase`;

    return `import '../../repositories/${d}_repository.dart';
import '../../entities/${d}/${d}.dart';

class ${useCaseClassName} {
  final I${D}Repository _repository;

  ${useCaseClassName}(this._repository);

  Future<List<${D}Entity>> call(${fkFieldType}${paramNullableMarker} ${fkFieldName}) {
    return _repository.get${Ds}By${methodNamePart}Id(${fkFieldName});
  }
}
`;
  }

  async generate(featurePath: string, entityName: string, data: { classParser: DriftClassParser, tableParser: DriftTableParser }): Promise<void> {
    const { classParser, tableParser } = data;

    if (!tableParser) {
        console.warn(`UseCaseGetByForeignKeyGenerator: tableParser не предоставлен для сущности ${entityName}. Файлы не будут сгенерированы.`);
        return;
    }

    const references = tableParser.getReferences();

    for (const ref of references) {
        const fkFieldName = ref.columnName;
        let methodNamePart = cap(fkFieldName);
        if (methodNamePart.endsWith('Id')) {
            methodNamePart = methodNamePart.slice(0, -2);
        }

        const filePath = this.getPath(featurePath, entityName, {fkFieldName, methodNamePart });
        const content = this.getContent({ classParser, fkReference: ref });
        await this.fileSystem.createFile(filePath, content);
        // console.log(`${useCaseClassName} успешно сгенерирован в ${filePath}`);
    }
  }
}