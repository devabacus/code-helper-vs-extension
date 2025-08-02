import { ServerpodField } from "./formatters/types";

export class TypeMapper {

  // Маппинг типов Serverpod в Dart/Drift
  static mapToDartType(serverpodType: string): string {
    const typeMap: Record<string, string> = {
      'UuidValue': 'String',
      'String': 'String',
      'int': 'int',
      'DateTime': 'DateTime',
      'bool': 'bool',
      'double': 'double'
    };

    return typeMap[serverpodType] || serverpodType;
  }

  // Маппинг типов в Drift колонки
  static mapToDriftColumn(serverpodType: string): string {
    const columnMap: Record<string, string> = {
      'UuidValue': 'text',
      'String': 'text',
      'int': 'integer',
      'DateTime': 'dateTime',
      'bool': 'boolean',
      'double': 'real'
    };

    return columnMap[serverpodType] || 'text';
  }

  // Генерация foreign key для связей
  static mapRelationToDriftForeignKey(field: ServerpodField): string {
    if (!field.isRelation || !field.relatedModel) {
      return '';
    }

    const columnName = `${field.name}Id`;
    const nullable = field.nullable ? '?' : '';

    return `TextColumn${nullable} get ${columnName} => text().named('${field.name}_id')();`;
  }

  // Получение имени колонки для foreign key
  static getForeignKeyColumnName(fieldName: string): string {
    return `${fieldName}Id`;
  }

  // Получение имени таблицы из модели (snake_case)
  static getTableNameFromModel(modelName: string): string {
    return modelName
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }
}