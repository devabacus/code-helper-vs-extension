// src/features/data_routine/generators/serverpod_endpoint_generator.ts

import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DriftClassParser } from '../feature/data/datasources/local/tables/drift_class_parser';
import { DriftTableParser } from '../feature/data/datasources/local/tables/drift_table_parser';
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
        let findByIdParamType = "int";

        if (pkField) {
            if (pkField.name === "id" && pkField.type === "String") {
                findByIdParamType = "UuidValue";
            } else if (pkField.type === "int") {
                findByIdParamType = "int";
            }
        } else {
            console.warn(`Поле первичного ключа не найдено для ${classNamePascal}, тип ID по умолчанию int для методов эндпоинта.`);
        }
        
        const importUuid = findByIdParamType === "UuidValue" ? "import 'package:serverpod/serverpod.dart' show UuidValue;\n" : "";

        return `import 'package:serverpod/serverpod.dart';
${importUuid}import 'package:${serverProjectNameSnake}/src/generated/protocol.dart';

class ${classNamePascal}Endpoint extends Endpoint {

  Future<${classNamePascal}> create${classNamePascal}(Session session, ${classNamePascal} ${classNameCamel}) async {
    await session.db.insertRow(${classNameCamel});
    return ${classNameCamel};
  }

  Future<${classNamePascal}?> get${classNamePascal}ById(Session session, ${findByIdParamType} id) async {
    return await session.db.findById<${classNamePascal}>(id);
  }

  Future<List<${classNamePascal}>> get${classNamePluralPascal}(Session session, {String? keyword}) async {
    // Пример простого поиска, можно расширить с помощью where, orderBy и т.д.
    // var whereClause = keyword != null ? (${classNameCamel}) => ${classNameCamel}.title.like('%$keyword%') : null; // Пример, если есть поле 'title'
    return await session.db.find<${classNamePascal}>(
      // where: whereClause,
      // orderBy: (${classNameCamel}) => ${classNameCamel}.id, // Предполагается поле 'id' или другое сортируемое поле
    );
  }

  Future<${classNamePascal}> update${classNamePascal}(Session session, ${classNamePascal} ${classNameCamel}) async {
    await session.db.updateRow(${classNameCamel});
    return ${classNameCamel};
  }

  Future<bool> delete${classNamePascal}(Session session, ${findByIdParamType} id) async {
    var count = await session.db.delete<${classNamePascal}>(
      // Предполагается, что 'id' - это поле первичного ключа в модели Serverpod
      where: (${classNameCamel}) => (${classNameCamel} as dynamic).id.equals(id),
    );
    return count > 0; // delete возвращает количество удаленных строк
  }

  // TODO: Добавить методы для связей M2M и O2M на основе tableParser.getTableRelations()
}
`;
    }
}