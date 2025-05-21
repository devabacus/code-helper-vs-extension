import assert from 'assert';
import { MockDriftTableParser } from '../../../../../../../mocks/mock_drift_table_parser';
import { Field } from '../../../../../../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser';

suite('Relation Table Parser', () => {
  test('должен корректно определять связанную таблицу', () => {
    // Имитация полей для связанной таблицы (task_tag_map)
    const fields: Field[] = [
      { name: 'taskId', type: 'int', isNullable: false },
      { name: 'tagId', type: 'int' , isNullable: false }
    ];

    // Имитация внешних ключей
    const references = [
      { columnName: 'taskId', referencedTable: 'TaskTable', referencedColumn: 'id' },
      { columnName: 'tagId', referencedTable: 'TagTable', referencedColumn: 'id' }
    ];

    // Создаем мок парсера
    const parser = new MockDriftTableParser({
      className: 'TaskTagMap',
      fields: fields,
      primaryKey: ['taskId', 'tagId'],
      references: references,
      isRelationTable: true,
      relatedTables: ['Task', 'Tag']
    });

    // Проверяем определение связанной таблицы
    assert.strictEqual(parser.isRelationTable(), true);
    
    // Проверяем получение связанных таблиц
    const relatedTables = parser.getRelatedTables();
    assert.strictEqual(relatedTables.length, 2);
    assert.strictEqual(relatedTables[0], 'Task');
    assert.strictEqual(relatedTables[1], 'Tag');
  });

  test('должен корректно обрабатывать обычную таблицу', () => {
    // Имитация полей для обычной таблицы
    const fields: Field[] = [
      { name: 'id', type: 'int', isNullable: false },
      { name: 'title', type: 'String', isNullable: false }
    ];

    // Создаем мок парсера
    const parser = new MockDriftTableParser({
      className: 'Task',
      fields: fields,
      isRelationTable: false
    });

    // Проверяем определение обычной таблицы
    assert.strictEqual(parser.isRelationTable(), false);
    
    // Проверяем, что связанных таблиц нет
    const relatedTables = parser.getRelatedTables();
    assert.strictEqual(relatedTables.length, 0);
  });
});