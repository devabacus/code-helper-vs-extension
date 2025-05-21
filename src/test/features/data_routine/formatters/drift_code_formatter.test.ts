// src/test/features/data_routine/formatters/drift_code_formatter.test.ts

import assert from "assert";
import { DriftCodeFormatter } from "../../../../features/data_routine/formatters/drift_code_formatter";

suite('DriftCodeFormatter', () => {
  let formatter: DriftCodeFormatter;
  const testFields = [
    { type: 'int', name: 'id', isNullable: false },
    { type: 'String', name: 'title', isNullable: false },
    { type: 'String', name: 'description', isNullable: false  }
  ];

  const testFieldsFull = [
    { type: 'int', name: 'id', isNullable: false },
    { type: 'String', name: 'title', isNullable: false },
    { type: 'DateTime', name: 'createdAt', isNullable: false },
    { type: 'bool', name: 'isCompleted', isNullable: false },
    { type: 'int', name: 'categoryId', isNullable: false },
  ];

  setup(() => {
    formatter = new DriftCodeFormatter();
  });

  test('formatFieldsForTest', () => {
    const expected1 = `title: 'title 1', createdAt: DateTime(1), isCompleted: false, categoryId: 1`;
    const expected2 = `title: 'title 2', createdAt: DateTime(2), isCompleted: true, categoryId: 2`;
    const expected3 = `id: Value(testId), title: Value('title 2'), createdAt: Value(DateTime(2)), isCompleted: Value(true), categoryId: Value(2)`;
    
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