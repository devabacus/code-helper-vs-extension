// src/features/data_routine/formatters/code_formatter.ts


import { cap } from '../../../utils/text_work/text_util';
import { Field, FieldValue } from '../feature/data/datasources/local/tables/drift_class_parser';
import { ServerpodField } from '../serverpod_yaml_parser/types';
import { ICodeFormatter } from './code_formatter.interface';
import { prepareFieldsForTest } from './drift_prepare_fields_for_test';

export class CodeFormatter implements ICodeFormatter {

  formatClassFields(fields: Field[]): string {
    // Для объявления полей класса в Freezed, тип также должен быть nullable
    const fieldRows = fields.map(field => `final ${field.type}${field.nullable ? '?' : ''} ${field.name};`);
    return fieldRows.join('\n');
  }

  formatRequiredFields(fields: Field[]): string {
    // Этот метод используется для `this.fieldName`
    const fieldRows = fields.map(field => `required this.${field.name},`);
    return fieldRows.join('\n');
  }

  formatRequiredTypeFields(fieldsWithStatic: Field[] | ServerpodField[]): string {
    const fields = this.fieldsFilter(fieldsWithStatic);
    const fieldRows = fields.map(field => {
      const typeString = `${field.type}${field.nullable ? '?' : ''}`;
      // Для Freezed: non-nullable поля без @Default становятся required автоматически.
      // Nullable поля - опциональные.
      if (field.nullable) {
        return `${typeString} ${field.name},`;
      } else {
        // Поля id часто имеют clientDefault, поэтому они не должны быть required в конструкторе модели/сущности
        if (field.name === 'id') {
          return `${typeString} ${field.name},`;
        }
        return `required ${typeString} ${field.name},`;
      }
    });
    return fieldRows.join('\n    ');
  }

  formatConstructorParams(fields: Field[] | ServerpodField[], instanceName?: string): string {
    const prefix = instanceName ? `${instanceName}.` : '';
    const params = fields.map(field => `${field.name}: ${prefix}${field.name}`);
    return params.join(', ');
  }

  formatFieldsComma(fields: Field[] | ServerpodField[]): string {
    return fields.map(field => field.name).join(', ');
  }

  formatValueWrappedFields(fields: Field[]): string {
    const wrapped = fields.map(field => `${field.name}: Value(${field.name})`);
    return wrapped.join(', ');
  }

  fieldsFilter(fields: Field[]): Field[] {
    const excludeList :any[] = ['isDeleted', 'id', 'userId', 'lastModified', 'syncStatus'];
    return fields.filter(field => !excludeList.includes(field.name));
  }


  formatSimpleFields(fields: Field[] | ServerpodField[]): string {
    const simple = this.fieldsFilter(fields as Field[]).map(field => `${field.name}: ${field.name}`);
    return simple.join(', ');
  }

  formatSimpleFieldsWithoutId(fields: Field[] | ServerpodField[]): string {
    const withoutId = fields.filter(field => field.name !== 'id');
    return this.formatSimpleFields(withoutId);
  }

  getParamsWithOutId(row: string): string {
    return row.replace(/.*id,\s?/, '');
  }

  // Методы для тестов (только для Field)
  getFieldsValueForTest(fields: Field[]): string[] {
    // return prepareFieldsForTest(fields);
    return [];
  }  

  getFieldsExpectValueTest(fields: Field[]): string[] {
    // Реализация для ожидаемых значений в тестах
    return fields.slice(1, 3).map((field, index) => `.${field.name}, '${field.name} ${index + 1}'`);
  }

  formatInsertCompanionParams(fields: Field[]): string {
    const paramFilter = this.fieldsFilter(fields);
    const params = paramFilter.map(field => {
      // if (field.name === 'id') {
      //   return `${field.name}: Value(testId)`;
      // }
      return `${field.name}: Value(${field.name})`;
    });
    return params.join(', ');
  }

  // Новые методы для работы с ServerpodModel
  generateDriftTableColumns(fields: ServerpodField[]): string {
    const columns: string[] = [];

    for (const field of fields) {
      if (this.shouldSkipServerpodField(field)) {
        continue;
      }

      // Если это поле связи, генерируем foreign key поле
      if (field.isRelation && field.relationType === 'manyToOne') {
        const foreignKeyColumn = this.generateForeignKeyColumn(field);
        columns.push(`  ${foreignKeyColumn}`);
      } else {
        const columnDefinition = this.generateColumnDefinition(field);
        columns.push(`  ${columnDefinition}`);
      }
    }

    return columns.join('\n');
  }

  private generateColumnDefinition(field: ServerpodField): string {
    const columnType = this.mapServerpodTypeToDriftColumn(field.type);
    let columnClass = cap(columnType);
    if (columnType === 'boolean') { columnClass = 'Bool'; }
    const nullable = field.nullable ? '.nullable()' : '';

    return `${columnClass}Column get ${field.name} => ${columnType}()${nullable}();`;
  }

  mapServerpodTypeToDriftColumn(serverpodType: string): string {
    const typeMap: Record<string, string> = {
      'UuidValue': 'text',
      'String': 'text',
      'int': 'integer',
      'DateTime': 'dateTime',
      'bool': 'boolean',
      'double': 'real'
    };

    return typeMap[serverpodType] || 'text';
  }

  shouldSkipServerpodField(field: ServerpodField): boolean {
    // Пропускаем служебные поля, которые уже определены статично
    const staticFields = ['id', 'userId', 'lastModified', 'syncStatus', 'isDeleted'];
    if (staticFields.includes(field.name)) {
      return true;
    }

    if (field.isRelation && field.relationType === 'oneToMany') {
    return true;
  }
    return false;
  }

  private generateForeignKeyColumn(field: ServerpodField): string {
    // Для связи category: Category?, relation создаем поле categoryId
    const foreignKeyFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
    const nullable = field.nullable ? '.nullable()' : '';

    // Получаем имя связанной таблицы из типа поля
    const relatedTableName = field.relatedModel ? `${field.relatedModel}Table` : '';
    const references = relatedTableName ? `.references(${relatedTableName}, #id)` : '';

    return `TextColumn get ${foreignKeyFieldName} => text()${nullable}${references}();`;
  }
}