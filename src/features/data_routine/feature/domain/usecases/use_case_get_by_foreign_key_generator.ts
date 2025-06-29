import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import {pluralConvert,cap,toSnakeCase,unCap,} from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import {ServerpodModel,ServerpodField,} from "../../../serverpod_yaml_parser/formatters/types";

export class UseCaseGetByForeignKeyGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(
    featurePath: string,
    entityName: string,
    fkDetails?: { fkFieldName: string; methodNamePart: string }
  ): string {
    if (!fkDetails) {
      return path.join(
        this.structure.getDomainUseCasesPath(featurePath),
        entityName,
        `get_${entityName}_by_foreign_key_base.dart`
      );
    }
    const useCaseFileName = `get_${pluralConvert(
      entityName
    )}_by_${toSnakeCase(fkDetails.methodNamePart)}_id.dart`;
    return path.join(
      this.structure.getDomainUseCasesPath(featurePath),
      entityName,
      useCaseFileName
    );
  }

  protected getContent(data: {
    model: ServerpodModel;
    fkField: ServerpodField;
  }): string {
    const { model, fkField } = data;

    const d = unCap(model.className); // task
    const D = model.className; // Task
    const Ds = pluralConvert(D); // Tasks

    const fkFieldName = fkField.name.endsWith("Id")
      ? fkField.name
      : `${fkField.name}Id`;
    const methodNamePart = cap(fkField.name.replace(/Id$/, ""));
    const fkFieldType = "String"; // В Serverpod ID обычно String (UuidValue)
    // const paramNullableMarker = fkField.nullable ? "?" : "";
    const useCaseClassName = `Get${Ds}By${methodNamePart}IdUseCase`;

    return `import '../../repositories/${d}_repository.dart';
import '../../entities/${d}/${d}.dart';

class ${useCaseClassName} {
  final I${D}Repository _repository;

  ${useCaseClassName}(this._repository);

  Future<List<${D}Entity>> call(${fkFieldType} ${fkFieldName}) {
    return _repository.get${Ds}By${methodNamePart}Id(${fkFieldName});
  }
}
`;
  }

  async generate(
    featurePath: string,
    entityName: string,
    model: ServerpodModel
  ): Promise<void> {
    const foreignKeyFields = model.fields.filter(
      (field) => field.isRelation && field.relationType === "manyToOne"
    );

    for (const fkField of foreignKeyFields) {
      const fkFieldName = fkField.name.endsWith("Id")
        ? fkField.name
        : `${fkField.name}Id`;
      const methodNamePart = cap(fkField.name.replace(/Id$/, ""));

      const filePath = this.getPath(featurePath, entityName, {
        fkFieldName,
        methodNamePart,
      });
      const content = this.getContent({ model, fkField });
      await this.fileSystem.createFile(filePath, content);
      console.log(`UseCaseGetByForeignKeyGenerator: Файл ${filePath} успешно сгенерирован.`);
    }
  }
}