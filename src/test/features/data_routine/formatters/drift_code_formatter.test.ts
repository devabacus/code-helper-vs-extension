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

  setup(() => {
    formatter = new DriftCodeFormatter();
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