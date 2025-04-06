import assert from "assert";
import { tableCategory, tableTask } from "./drift_class_examples";
import { DriftTableParser } from "../../../../../../../../features/data_routine/feature/data/datasources/local/tables/drift_table_parser";
import { tableTaskTagMapExample } from "./drift_relation_examples";

suite('DriftTableParser Tests', () => {
  
  test('должен корректно парсить обычную таблицу', () => {
    const parser = new DriftTableParser(tableCategory);
    
    // Проверяем основные методы
    assert.strictEqual(parser.getClassName(), "Category");
    assert.strictEqual(parser.getClassNameLower(), "category");
    
    // Проверяем поля
    const fields = parser.getFields();
    assert.strictEqual(fields.length, 2);
    assert.strictEqual(fields[0].name, "id");
    assert.strictEqual(fields[0].type, "int");
    assert.strictEqual(fields[1].name, "title");
    assert.strictEqual(fields[1].type, "String");
    
    // Проверяем что это не связанная таблица
    assert.strictEqual(parser.isRelationTable(), false);
    assert.strictEqual(parser.getRelatedTables().length, 0);
  });
  
  test('должен корректно парсить связанную таблицу', () => {
    const parser = new DriftTableParser(tableTaskTagMapExample);
    
    // Проверяем основные методы
    assert.strictEqual(parser.getClassName(), "TaskTagMap");
    assert.strictEqual(parser.getClassNameLower(), "taskTagMap");
    
    // Проверяем поля
    const fields = parser.getFields();
    assert.strictEqual(fields.length, 2);
    assert.strictEqual(fields[0].name, "taskId");
    assert.strictEqual(fields[0].type, "int");
    assert.strictEqual(fields[1].name, "tagId");
    assert.strictEqual(fields[1].type, "int");
    
    // Проверяем определение внешних ключей
    const references = parser.getReferences();
    assert.strictEqual(references.length, 2);
    assert.strictEqual(references[0].columnName, "taskId");
    assert.strictEqual(references[0].referencedTable, "TaskTable");
    assert.strictEqual(references[1].columnName, "tagId");
    assert.strictEqual(references[1].referencedTable, "TagTable");
    
    // Проверяем определение связанной таблицы
    assert.strictEqual(parser.isRelationTable(), true);
    
    // Проверяем получение связанных таблиц (без 'Table' суффикса)
    const relatedTables = parser.getRelatedTables();
    assert.strictEqual(relatedTables.length, 2);
    assert.strictEqual(relatedTables[0], "Task");
    assert.strictEqual(relatedTables[1], "Tag");
  });
});