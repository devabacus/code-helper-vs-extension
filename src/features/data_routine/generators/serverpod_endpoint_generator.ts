// src/features/data_routine/generators/serverpod_endpoint_generator.ts

import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DriftClassParser } from '../feature/data/datasources/local/tables/drift_class_parser';
import { DriftTableParser, Field as DriftField } from '../feature/data/datasources/local/tables/drift_table_parser'; // Импортируем Field
import { cap, unCap, toSnakeCase, pluralConvert } from '../../../utils/text_work/text_util';

export class ServerpodEndpointGenerator extends BaseGenerator<{ classParser: DriftClassParser, tableParser: DriftTableParser }> {
    constructor(fileSystem: IFileSystem) {
        super(fileSystem);
    }

    protected getPath(basePath: string, entityNamePascalCase?: string): string {
        if (!entityNamePascalCase) {
            throw new Error("Имя сущности (PascalCase) обязательно для пути ServerpodEndpointGenerator.");
        }
        return path.join(basePath, `${toSnakeCase(entityNamePascalCase)}_endpoint.dart`);
    }

    protected getContent(
        data?: { classParser: DriftClassParser, tableParser: DriftTableParser },
        entityNamePascalCase?: string,
        baseEndpointsPath?: string
    ): string {
        if (!data || !entityNamePascalCase || !baseEndpointsPath) {
            throw new Error("Данные (classParser, tableParser), имя сущности (PascalCase) и baseEndpointsPath обязательны для содержимого ServerpodEndpointGenerator.");
        }

        const { tableParser } = data;

        const classNamePascal = entityNamePascalCase;
        const classNameCamel = unCap(classNamePascal);
        const classNamePluralPascal = pluralConvert(classNamePascal);

        const serverProjectLibPath = path.join(baseEndpointsPath, '..', '..');
        const serverProjectRootPath = path.join(serverProjectLibPath, '..');
        const serverProjectNameSnake = path.basename(serverProjectRootPath);

        const pkField = tableParser.getFields().find(f => tableParser.getPrimaryKey().includes(f.name));
        let findByIdParamType = "int"; // Тип параметра для методов getById, delete

        if (pkField) {
            if (pkField.name === "id" && pkField.type === "String") {
                findByIdParamType = "UuidValue";
            } else if (pkField.type === "int") {
                findByIdParamType = "int";
            }
        } else {
            console.warn(`Поле первичного ключа не найдено для ${classNamePascal}, тип ID по умолчанию int для методов эндпоинта.`);
        }
        
        // Определение поля для сортировки по умолчанию
        const fields: DriftField[] = tableParser.getFields(); // Используем поля из DriftTableParser
        let orderByField = "id"; // По умолчанию сортируем по id
        if (fields.find(f => f.name === "title")) {
            orderByField = "title";
        } else if (fields.find(f => f.name === "name")) {
            orderByField = "name";
        }

        // Лямбда-параметр для доступа к полям таблицы (обычно короткое имя, например, 't' или первая буква)
        const tableLambdaVar = "t"; 

        return `import 'package:serverpod/serverpod.dart';
import 'package:${serverProjectNameSnake}/src/generated/protocol.dart';

class ${classNamePascal}Endpoint extends Endpoint {
  Future<${classNamePascal}> create${classNamePascal}(Session session, ${classNamePascal} ${classNameCamel}) async {
    await session.db.insertRow(${classNameCamel});
    return ${classNameCamel};
  }

  Future<${classNamePascal}?> get${classNamePascal}ById(Session session, ${findByIdParamType} id) async {
    return await session.db.findById<${classNamePascal}>(id);
  }

  Future<List<${classNamePascal}>> get${classNamePluralPascal}(Session session) async {
    return await ${classNamePascal}.db.find(
      session,
      orderBy: (${tableLambdaVar}) => ${tableLambdaVar}.${orderByField},
    );
  }

  Future<bool> update${classNamePascal}(Session session, ${classNamePascal} ${classNameCamel}) async {
    try {
      await session.db.updateRow(${classNameCamel});
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> delete${classNamePascal}(Session session, ${findByIdParamType} id) async {
    try {
      var deletedItems = await ${classNamePascal}.db.deleteWhere(
        session,
        where: (${tableLambdaVar}) => ${tableLambdaVar}.id.equals(id),
      );
      return deletedItems.isNotEmpty;
    } catch (e) {
      return false;
    }
  }
}
`;
    }
}