import assert from 'assert';
import { ServerpodYamlParser } from '../../../../../../../../features/data_routine/feature/data/datasources/local/tables/serverpod_yaml_parser';

// Пример YAML (предполагаем, что он всегда валиден для этого теста)
const serverpodYamlExample = `
class: MyEntity
table: my_entity # Это поле будет проигнорировано парсером, но для полноты примера оставим
fields:
  uuid: String
  title: String
  description: String?
  priority: int
  value: double?
  isActive: bool
  createdAt: DateTime
`;

suite('Ультра-упрощенный Serverpod YAML Parser Test Suite', () => {
  test('должен корректно парсить имя класса и поля из валидного YAML', () => {
    const parser = new ServerpodYamlParser(serverpodYamlExample);
    const result = parser.parse(); // Ожидаем, что этот вызов не упадет

    // Проверка имени класса
    assert.strictEqual(result.className, 'MyEntity', 'Имя класса должно быть "MyEntity"');

    // Ожидаемые поля
    const expectedFields = [
      { name: 'uuid', type: 'String', isNullable: false },
      { name: 'title', type: 'String', isNullable: false },
      { name: 'description', type: 'String', isNullable: true },
      { name: 'priority', type: 'int', isNullable: false },
      { name: 'value', type: 'double', isNullable: true },
      { name: 'isActive', type: 'bool', isNullable: false },
      { name: 'createdAt', type: 'DateTime', isNullable: false },
    ];

   
    assert.deepStrictEqual(result.fields, expectedFields, 'Спарсенные поля не соответствуют ожидаемым.');

  });
});