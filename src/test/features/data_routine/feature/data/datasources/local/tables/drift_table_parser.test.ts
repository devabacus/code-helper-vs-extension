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
    assert.strictEqual(fields[0].type, "String");
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


  test('должен возвращать пустой массив TableRelation для таблицы без связей', () => {
  const simpleTableCode = `
    class SimpleTable extends Table {
      IntColumn get id => integer().autoIncrement()();
      TextColumn get name => text()();
    }
  `;
  const parser = new DriftTableParser(simpleTableCode);
  const relations = parser.getTableRelations();
  assert.strictEqual(relations.length, 0, 'Массив связей должен быть пустым');
});

 test('должен корректно возвращать несколько ONE_TO_MANY TableRelation для OrderTable', () => {
    // Строка ТОЛЬКО с определением OrderTable
    const orderTableDefinition = `
      class OrderTable extends Table {
        IntColumn get id => integer().autoIncrement()();
        TextColumn get orderDetails => text()();
        IntColumn get customerId => integer().references(CustomerTable, #id)();
        IntColumn get productId => integer().references(ProductTable, #id)();

        @override
        Set<Column> get primaryKey => {id}; // Это НЕ join table
      }
    `;
    // Предполагается, что CustomerTable и ProductTable "известны" Drift,
    // для парсера OrderTable важны только их имена в .references()

    const parser = new DriftTableParser(orderTableDefinition);
    const relations = parser.getTableRelations();
    
    // Сначала убедимся, что парсер правильно определил имя текущего класса
    assert.strictEqual(parser.getClassName(), "Order", "Имя класса должно быть 'Order'");
    
    assert.strictEqual(relations.length, 2, 'Должно быть две связи ONE_TO_MANY');

    const customerRelation = relations.find(r => r.targetTable === 'Customer');
    assert.ok(customerRelation, 'Должна быть найдена связь с CustomerTable');
    // Теперь это утверждение должно проходить:
    assert.strictEqual(customerRelation!.sourceTable, 'Order', "Источник связи Order-Customer должен быть 'Order'");
    assert.strictEqual(customerRelation!.relationType, RelationType.ONE_TO_MANY);
    assert.strictEqual(customerRelation!.sourceField, 'customerId');
    assert.strictEqual(customerRelation!.targetField, 'id');

    const productRelation = relations.find(r => r.targetTable === 'Product');
    assert.ok(productRelation, 'Должна быть найдена связь с ProductTable');
    // И это утверждение тоже:
    assert.strictEqual(productRelation!.sourceTable, 'Order', "Источник связи Order-Product должен быть 'Order'");
    assert.strictEqual(productRelation!.relationType, RelationType.ONE_TO_MANY);
    assert.strictEqual(productRelation!.sourceField, 'productId');
    assert.strictEqual(productRelation!.targetField, 'id');
  });

});