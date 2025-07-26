import { RelationAnalyzer } from '../serverpod_yaml_parser/relation-analyzer';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { cap, pluralConvert, unCap } from '../../../utils/text_work/text_util';

export function generateDaoManyToOneMethods(model: ServerpodModel): string {
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);

    // Если связей такого типа нет, ничего не генерируем
    if (relationFields.length === 0) {
        return '';
    }

    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    return relationFields.map(field => {
        const fieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const daoMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fieldName;
        const parameterType = 'String'; // Или можно определять тип из поля

        return `
  Future<List<${D}TableData>> ${daoMethodName}(${parameterType} ${parameterName}, {required int userId, required String customerId}) =>
    (select(${d}Table)
      ..where((t) => t.${parameterName}.equals(${parameterName}) & t.userId.equals(userId) & t.customerId.equals(customerId) & t.isDeleted.equals(false)))
    .get();`;
    }).join('\n');
}


export function generateLocalDatasourceManyToOneMethods(model: ServerpodModel): string {
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);

    if (relationFields.length === 0) {
        return '';
    }

    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    return relationFields.map(field => {
        // Определяем имя поля внешнего ключа (например, categoryId)
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        // Определяем часть имени метода (например, Category из categoryId)
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        // Собираем полное имя метода (например, getProductsByCategoryId)
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;
        const parameterType = 'String'; // У Serverpod все ID - строки

        return `
  @override
  Future<List<${D}Model>> ${dsMethodName}(${parameterType} ${parameterName}, {required int userId, required String customerId}) async {
    final ${d}TableData = await _${d}Dao.${dsMethodName}(${parameterName}, userId: userId, customerId: customerId);
    return ${d}TableData.toModels();
  }`;
    }).join('\\n');
}


export function generateLocalDatasourceServiceManyToOneMethods(model: ServerpodModel): string {
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);
    if (relationFields.length === 0) {return ''};

    const D = model.className;
    const Ds = pluralConvert(D);

    return relationFields.map(field => {
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;
        const parameterType = 'String';

        return `
  Future<List<${D}Model>> ${dsMethodName}(${parameterType} ${parameterName}, {required int userId, required String customerId});`;
    }).join('');
}

/**
 * Генерирует абстрактные методы для ICategoryRemoteDataSource.
 */
export function generateRemoteDatasourceServiceManyToOneMethods(model: ServerpodModel): string {
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);
    if (relationFields.length === 0) return '';

    const D = model.className;
    const Ds = pluralConvert(D);

    return relationFields.map(field => {
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;

        // В удаленном источнике данных мы можем использовать UuidValue
        return `
  Future<List<${D}>> ${dsMethodName}(UuidValue ${parameterName});`;
    }).join('');
}

/**
 * Генерирует реализацию методов для CategoryRemoteDataSource.
 */
export function generateRemoteDatasourceManyToOneMethods(model: ServerpodModel): string {
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);
    if (relationFields.length === 0) return '';
    
    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    return relationFields.map(field => {
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;

        return `
  @override
  Future<List<${D}>> ${dsMethodName}(UuidValue ${parameterName}) async {
    try {
      final result = await _client.${d}.${dsMethodName}(${parameterName});
      return result;
    } catch (e) {
      print('Ошибка получения ${Ds} по ${methodNamePart} ID: $e');
      rethrow;
    }
  }`;
    }).join('');
}
// Сюда в будущем можно будет добавить:
// export function generateEntityOneToManyFields(model: ServerpodModel): string { ... }
// export function generateRepositoryManyToManyLogic(model: ServerpodModel): string { ... }