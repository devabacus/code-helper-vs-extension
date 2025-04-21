// src/test/features/data_routine/formatters/drift_code_formatter.test.ts

import assert from "assert";
import { DriftCodeFormatter } from "../../../../features/data_routine/formatters/drift_code_formatter";

suite('DriftCodeFormatter', () => {
  let formatter: DriftCodeFormatter;
  const testFields = [
    { type: 'int', name: 'id' },
    { type: 'String', name: 'title' },
    { type: 'String', name: 'description' }
  ];

  const testFieldsFull = [
    { type: 'int', name: 'id' },
    { type: 'String', name: 'title' },
    { type: 'DateTime', name: 'createdAt' },
    { type: 'bool', name: 'isCompleted' },
    { type: 'int', name: 'categoryId' },
  ];

  setup(() => {
    formatter = new DriftCodeFormatter();
  });

  test('formatFieldsForTest', () => {
    const expected1 = `title: 'title 1',\ncreatedAt: DateTime(1),\nisCompleted: false,\ncategoryId: 1`;
    const expected2 = `title: 'title 2',\ncreatedAt: DateTime(2),\nisCompleted: true,\ncategoryId: 2`;
    const expected3 = `id: Value(1),\ntitle: Value('title 2'),\ncreatedAt: Value(DateTime(2)),\nisCompleted: Value(true),\ncategoryId: Value(2)`;
    
    assert.strictEqual(formatter.getFieldsValueForTest(testFieldsFull)[0], expected1);
    assert.strictEqual(formatter.getFieldsValueForTest(testFieldsFull)[1], expected2);
    assert.strictEqual(formatter.getFieldsValueForTest(testFieldsFull)[2], expected3);

  });


  test('getFieldsExpectValueTest', () => {
    const expected1 = `.title, 'title 1'`;
    const expected2 = `.title, 'title 2'`;

    assert.strictEqual(formatter.getFieldsExpectValueTest(testFieldsFull)[0], expected1);
    assert.strictEqual(formatter.getFieldsExpectValueTest(testFieldsFull)[1], expected2)
  });


  test('formatClassFields должен корректно форматировать поля класса', () => {
    const expected = 'final int id;\nfinal String title;\nfinal String description;';
    assert.strictEqual(formatter.formatClassFields(testFields), expected);
  });

  test('formatRequiredFields должен корректно форматировать required поля', () => {
    const expected = 'required this.id,\nrequired this.title,\nrequired this.description,';
    assert.strictEqual(formatter.formatRequiredFields(testFields), expected);
  });

  test('formatConstructorParams должен корректно форматировать параметры конструктора без префикса', () => {
    const expected = 'id: id, title: title, description: description';
    assert.strictEqual(formatter.formatConstructorParams(testFields), expected);
  });

  test('formatConstructorParams должен корректно форматировать параметры конструктора с префиксом', () => {
    const expected = 'id: model.id, title: model.title, description: model.description';
    assert.strictEqual(formatter.formatConstructorParams(testFields, 'model'), expected);
  });

  test('formatFieldsComma должен корректно соединять имена полей через запятую', () => {
    const expected = 'id,title,description';
    assert.strictEqual(formatter.formatFieldsComma(testFields), expected);
  });

  test('formatValueWrappedFields должен корректно оборачивать поля в Value', () => {
    const expected = 'id: Value(id), title: Value(title), description: Value(description)';
    assert.strictEqual(formatter.formatValueWrappedFields(testFields), expected);
  });

  test('formatSimpleFields должен корректно форматировать поля в виде field: field', () => {
    const expected = 'id: id, title: title, description: description';
    assert.strictEqual(formatter.formatSimpleFields(testFields), expected);
  });

  test('formatSimpleFieldsWithoutId должен корректно форматировать поля без id', () => {
    const expected = 'title: title, description: description';
    assert.strictEqual(formatter.formatSimpleFieldsWithoutId(testFields), expected);
  });
});