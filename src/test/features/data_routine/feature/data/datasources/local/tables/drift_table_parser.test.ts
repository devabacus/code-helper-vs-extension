import assert from "assert";
import { tableCategory, tableTask } from "./drift_class_examples";
import { DriftTableParser } from "../../../../../../../../features/data_routine/feature/data/datasources/local/tables/drift_table_parser";
import { tableTaskTagMapExample } from "./drift_relation_examples";
import { RelationType } from "../../../../../../../../features/data_routine/interfaces/table_relation.interface";

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



  test('должен корректно возвращать TableRelation для one-to-many связи', () => {
    const taskTableCode = `
    class TaskTable extends Table {
      IntColumn get id => integer().autoIncrement()();
      TextColumn get title => text()();
      IntColumn get categoryId => integer().references(CategoryTable, #id)();
    }
    `;
    
    const parser = new DriftTableParser(taskTableCode);
    const relations = parser.getTableRelations();
    
    assert.strictEqual(relations.length, 1);
    assert.strictEqual(relations[0].sourceTable, 'Task');
    assert.strictEqual(relations[0].targetTable, 'Category');
    assert.strictEqual(relations[0].relationType, RelationType.ONE_TO_MANY);
    assert.strictEqual(relations[0].sourceField, 'categoryId');
    assert.strictEqual(relations[0].targetField, 'id');
  });
  
  test('должен корректно возвращать TableRelation для many-to-many связи', () => {
    const taskTagMapTableCode = `
    class TaskTagMapTable extends Table {
      IntColumn get taskId => integer().references(TaskTable, #id)();
      IntColumn get tagId => integer().references(TagTable, #id)();
      
      @override
      Set<Column> get primaryKey => {taskId, tagId};
    }
    `;
    
    const parser = new DriftTableParser(taskTagMapTableCode);
    const relations = parser.getTableRelations();
    
    assert.strictEqual(relations.length, 1);
    assert.strictEqual(relations[0].sourceTable, 'Task');
    assert.strictEqual(relations[0].targetTable, 'Tag');
    assert.strictEqual(relations[0].relationType, RelationType.MANY_TO_MANY);
    assert.strictEqual(relations[0].intermediateTable, 'TaskTagMap');
    assert.strictEqual(relations[0].sourceField, 'taskId');
    assert.strictEqual(relations[0].targetField, 'tagId');
  });

});