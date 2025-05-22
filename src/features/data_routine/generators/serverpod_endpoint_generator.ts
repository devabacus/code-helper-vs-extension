import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator'; //
import { IFileSystem } from '../../../core/interfaces/file_system'; //
import { DriftClassParser, Field as DriftClassField } from '../feature/data/datasources/local/tables/drift_class_parser'; //
import { cap, unCap, toSnakeCase, pluralConvert } from '../../../utils/text_work/text_util'; //
import { DriftTableParser } from '../feature/data/datasources/local/tables/drift_table_parser';

export class ServerpodEndpointGenerator extends BaseGenerator<{ classParser: DriftClassParser, tableParser: DriftTableParser }> {
    constructor(fileSystem: IFileSystem) {
        super(fileSystem);
    }

    protected getPath(basePath: string, entityNamePascalCase?: string): string {
        if (!entityNamePascalCase) {
            throw new Error("Имя сущности (PascalCase) обязательно для пути ServerpodEndpointGenerator.");
        }
        return path.join(basePath, `${toSnakeCase(entityNamePascalCase)}_endpoint.dart`); //
    }

    private getFkIdServerpodType(fkDriftFieldType: string, isNullable: boolean): string {
        let type = 'UuidValue'; // По умолчанию для String ID из Drift
        if (fkDriftFieldType === 'int') {
            type = 'int';
        }
        // Добавьте другие маппинги при необходимости
        return type + (isNullable ? '?' : '');
    }

    protected getContent(
        data?: { classParser: DriftClassParser, tableParser: DriftTableParser },
        entityNamePascalCase?: string, // Это classNamePascal
        baseEndpointsPath?: string     // Путь к директории endpoints серверного проекта
    ): string {
        if (!data || !entityNamePascalCase || !baseEndpointsPath) {
            throw new Error("Данные (classParser, tableParser), имя сущности (PascalCase) и baseEndpointsPath обязательны для содержимого ServerpodEndpointGenerator.");
        }

        const { classParser, tableParser } = data;

        const classNamePascal = entityNamePascalCase; // Task
        const classNameCamel = unCap(classNamePascal); // task
        const classNamePluralPascal = pluralConvert(classNamePascal); // Tasks

        // Определение имени серверного проекта для импортов
        // baseEndpointsPath = <server_project_root>/lib/src/endpoints
        // Нам нужен <server_project_name>
        const serverProjectLibSrcPath = path.join(baseEndpointsPath, '..'); // <server_project_root>/lib/src
        const serverProjectLibPath = path.join(serverProjectLibSrcPath, '..'); // <server_project_root>/lib
        const serverProjectRootPath = path.join(serverProjectLibPath, '..'); // <server_project_root>
        const serverProjectNameSnake = path.basename(serverProjectRootPath); // server_project_name

        const pkDriftFieldInfo = classParser.fields.find(f => f.name === 'id'); // Ищем поле ID в DriftClassParser
        let findByIdParamType = "UuidValue"; // Тип для getById, delete (Serverpod ID type)

        if (pkDriftFieldInfo) {
            if (pkDriftFieldInfo.type === "int") {
                findByIdParamType = "int";
            } else if (pkDriftFieldInfo.type === "String") {
                findByIdParamType = "UuidValue";
            }
        } else {
            // Если поле 'id' не найдено или его тип неизвестен, используем UuidValue по умолчанию,
            // но это может потребовать внимания, если PK не 'id' или не String/int.
            // Для Serverpod стандартный PK - это 'id' типа int (по умолчанию) или UuidValue.
            // console.warn(`Поле первичного ключа 'id' не найдено или имеет неожиданный тип для ${classNamePascal} в DriftClassParser. Тип ID для эндпоинта по умолчанию UuidValue.`);
        }
        
        const driftFields: DriftClassField[] = classParser.fields;
        let orderByField = "id"; 
        if (driftFields.find(f => f.name === "title")) {
            orderByField = "title";
        } else if (driftFields.find(f => f.name === "name")) {
            orderByField = "name";
        }
        // Если orderByField это 'id', а тип 'id' в Drift был String (стал UuidValue в Serverpod),
        // то для orderBy может потребоваться t.id.uuid если бы мы сортировали по строковому представлению.
        // Но так как t.id в Serverpod уже правильного типа (int или UuidValue), просто t.id должно работать.

        const tableLambdaVar = classNameCamel.charAt(0); 

        let foreignKeyEndpointMethods = '';
        const references = tableParser.getReferences(); //

        if (references && references.length > 0) {
            foreignKeyEndpointMethods = references.map(ref => {
                const fkColumnName = ref.columnName; // e.g., categoryId (из Drift таблицы)
                
                const fkFieldDetailsInDrift = classParser.fields.find(f => f.name === fkColumnName);
                if (!fkFieldDetailsInDrift) {
                    console.warn(`ServerpodEndpointGenerator: Не найдены детали для поля внешнего ключа ${fkColumnName} в classParser для ${classNamePascal}. Пропуск генерации метода.`);
                    return '';
                }

                const fkParamServerpodType = this.getFkIdServerpodType(fkFieldDetailsInDrift.type, fkFieldDetailsInDrift.isNullable);
                
                // Имя для части метода: categoryId -> Category
                let methodNamePart = cap(fkColumnName.replace(/Id$/, '')); 

                const endpointMethodName = `get${classNamePluralPascal}By${methodNamePart}Id`;

                // В Serverpod, если у вас в YAML есть 'category: Category?, relation',
                // то в сгенерированном Dart классе для таблицы Task будет поле 'categoryId'
                // (или то имя, которое Serverpod выберет/вы укажете для хранения ID).
                // Мы будем использовать имя столбца fkColumnName (categoryId) для запроса.
                return `
  Future<List<${classNamePascal}>> ${endpointMethodName}(Session session, ${fkParamServerpodType} ${fkColumnName}) async {
    return await ${classNamePascal}.db.find(
      session,
      where: (${tableLambdaVar}) => ${tableLambdaVar}.${fkColumnName}.equals(${fkColumnName}),
      orderBy: (${tableLambdaVar}) => ${tableLambdaVar}.${orderByField},
    );
  }
`;
            }).join('\n');
        }

        return `import 'package:serverpod/serverpod.dart';
import 'package:${serverProjectNameSnake}/src/generated/protocol.dart';

class ${classNamePascal}Endpoint extends Endpoint {
  Future<${classNamePascal}> create${classNamePascal}(Session session, ${classNamePascal} ${classNameCamel}) async {
    await ${classNamePascal}.db.insertRow(session, ${classNameCamel});
    return ${classNameCamel};
  }

  Future<${classNamePascal}?> get${classNamePascal}ById(Session session, ${findByIdParamType} id) async {
    return await ${classNamePascal}.db.findById(session, id);
  }

  Future<List<${classNamePascal}>> get${classNamePluralPascal}(Session session) async {
    return await ${classNamePascal}.db.find(
      session,
      orderBy: (${tableLambdaVar}) => ${tableLambdaVar}.${orderByField},
    );
  }
${foreignKeyEndpointMethods}
  Future<bool> update${classNamePascal}(Session session, ${classNamePascal} ${classNameCamel}) async {
    try {
      await ${classNamePascal}.db.updateRow(session, ${classNameCamel});
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> delete${classNamePascal}(Session session, ${findByIdParamType} id) async {
    try {
      var result = await ${classNamePascal}.db.deleteWhere(
        session,
        where: (${tableLambdaVar}) => ${tableLambdaVar}.id.equals(id),
      );
      return result.isNotEmpty;
    } catch (e) {
      return false;
    }
  }
}
`;
    }
}