// src/test/features/data_routine/feature/data/repositories/relation_repository_generator.test.ts
import path from "path";
import { RelationRepositoryGenerator } from "../../../../../../features/data_routine/feature/data/repositories/relation_repository_generator";
import { RelationType, TableRelation } from "../../../../../../features/data_routine/interfaces/table_relation.interface";
import { MockFileSystem } from "../../../../../mocks/mock_file_system";
import assert from "assert";

suite('RelationRepositoryGenerator', () => {
  let mockFileSystem: MockFileSystem;
  let relation: TableRelation;
  
  setup(() => {
    mockFileSystem = new MockFileSystem();
    relation = {
      sourceTable: 'Task',
      targetTable: 'Tag',
      relationType: RelationType.MANY_TO_MANY,
      intermediateTable: 'TaskTagMap',
      sourceField: 'taskId',
      targetField: 'tagId'
    };
  });
  
// src/test/features/data_routine/feature/data/repositories/relation_repository_generator.test.ts
test('должен сгенерировать relation repository файл с правильным контентом', async () => {
  const featurePath = path.join("test", "feature");
  const relationName = "taskTagMap";
  
  // Создаем генератор напрямую
  const generator = new RelationRepositoryGenerator(mockFileSystem, relation);
  
  // Явно вызываем метод генерации
  await generator.generate(featurePath, relationName);
  
  // Получаем путь к созданному файлу с правильным форматированием
  const intermediateTableName = relation.intermediateTable || '';
  const snakeCaseName = intermediateTableName
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
  
  const expectedPath = path.join(featurePath, "data", "repositories", `${snakeCaseName}_repository_impl.dart`);
  
  // Выводим созданные файлы для отладки
  console.log("Созданные файлы:", Object.keys(mockFileSystem.createdFiles));
  
  const actualContent = mockFileSystem.createdFiles[expectedPath];
  
  // Проверяем, что файл создан
  assert.ok(actualContent, `Файл должен быть создан по пути: ${expectedPath}`);

  // Проверяем содержимое файла с динамическими именами методов
assert.ok(actualContent.includes("class TaskTagMapRepositoryImpl implements TaskTagMapRepository"), 
          "Должен содержать правильный класс репозитория");
assert.ok(actualContent.includes(`get${relation.targetTable}sFor${relation.sourceTable}`), 
          "Должен содержать метод для получения целевых сущностей");
assert.ok(actualContent.includes(`get${relation.sourceTable}sWith${relation.targetTable}`), 
          "Должен содержать метод для получения исходных сущностей");
});
});