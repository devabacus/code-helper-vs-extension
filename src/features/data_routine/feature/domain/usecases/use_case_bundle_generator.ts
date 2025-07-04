import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { pluralConvert, cap, unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ServerpodModel, ServerpodField } from "../../../serverpod_yaml_parser/formatters/types";

export class UseCaseBaseGenerator extends DataRoutineGenerator {
  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featurePath),`${entityName}_usecases.dart`);
  }

  // Основной метод теперь принимает модель и генерирует всё содержимое
  protected getContent(model: ServerpodModel): string {
    const D = cap(model.className);       // Task -> Task
    const d = unCap(model.className);      // Task -> task
    const Ds = pluralConvert(D);          // Task -> Tasks (для GetAll и т.д.)

    // --- 1. Генерируем базовые use case'ы (ваш код) ---
    const baseUseCases = `
class Create${D}UseCase {
  final I${D}Repository _repository;
  
  Create${D}UseCase(this._repository);
  
  Future<String> call(${D}Entity ${d}) {
    return _repository.create${D}(${d});
  }
}

class Update${D}UseCase {
  final I${D}Repository _repository;

  Update${D}UseCase(this._repository);

  Future<bool> call(${D}Entity ${d}) async {
    return _repository.update${D}(${d});
  }
}

class Delete${D}UseCase {
  final I${D}Repository _repository;

  Delete${D}UseCase(this._repository);

  Future<bool> call(String id) async {
    return _repository.delete${D}(id);
  }
}

class Get${Ds}UseCase {
  final I${D}Repository _repository;

  Get${Ds}UseCase(this._repository);

  Future<List<${D}Entity>> call() {
    return _repository.get${Ds}();
  }
}

class Get${D}ByIdUseCase {
  final I${D}Repository _repository;

  Get${D}ByIdUseCase(this._repository);

  Future<${D}Entity?> call(String id) {
    return _repository.get${D}ById(id);
  }
}

class Watch${Ds}UseCase {
  final I${D}Repository _repository;

  Watch${Ds}UseCase(this._repository);

  Stream<List<${D}Entity>> call() {
    return _repository.watch${Ds}();
  }
}`;

    // --- 2. Генерируем use case'ы для внешних ключей (логика из второго файла) ---
    const foreignKeyUseCases = this._generateGetByFkUseCases(model, D, Ds);

    // --- 3. Объединяем все части ---
    // Добавляем импорты в начало
    const imports = `import '../repositories/${d}_repository.dart';
import '../entities/${d}/${d}_entity.dart';`;

    return `${imports}\n${baseUseCases}\n\n${foreignKeyUseCases.join('\n\n')}`;
  }

  // Приватный метод для генерации связанных use case'ов
  private _generateGetByFkUseCases(model: ServerpodModel, D: string, Ds: string): string[] {
    const fkFields = model.fields.filter(
      (field) => field.isRelation && field.relationType === "manyToOne"
    );

    return fkFields.map(fkField => {
        const fkFieldName = fkField.name.endsWith("Id")
            ? fkField.name
            : `${fkField.name}Id`;
        const methodNamePart = cap(fkField.name.replace(/Id$/, ""));
        const fkFieldType = "String"; // В Serverpod ID обычно это String (UuidValue)
        
        const useCaseClassName = `Get${Ds}By${methodNamePart}IdUseCase`;

        return `class ${useCaseClassName} {
  final I${D}Repository _repository;

  ${useCaseClassName}(this._repository);

  Future<List<${D}Entity>> call(${fkFieldType} ${fkFieldName}) {
    return _repository.get${Ds}By${methodNamePart}Id(${fkFieldName});
  }
}`;
    });
  }
}