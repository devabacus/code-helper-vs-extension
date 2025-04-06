// src/test/features/data_routine/feature/data/datasources/local/dao/relation_dao_generator.test.ts

import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { taskTagMapDaoExample } from "./relation_dao_example";
import { TestDataFactory } from "../../../../../fixtures/test_data_factory";
import { RelationDaoGenerator } from "../../../../../../../../features/data_routine/feature/data/datasources/local/dao/relation_dao_generator";
import { RelationType } from "../../../../../../../../features/data_routine/interfaces/table_relation.interface";
import assert from "assert";
import { MockFileSystem } from "../../../../../../../mocks/mock_file_system";

suite('RelationDaoGenerator', () => {
  // Создаем наследника для тестирования
  class RelationDaoGeneratorTest extends BaseDataRoutineGeneratorTest {
    // Публичные методы для доступа к защищенным членам базового класса
    public createTestGenerator(fileSystem: IFileSystem): FileGenerator {
      return new RelationDaoGenerator(fileSystem);
    }
    
    public getTestExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "data", "datasources", "local", "dao", `${entityName}_dao.dart`);
    }
    
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return this.createTestGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return this.getTestExpectedPath(featurePath, entityName);
    }
    
    // Публичный метод для проверки создания файла
    public assertTestFileCreated(expectedPath: string, expectedContent: string): void {
      assert.ok(this.mockFileSystem.createdFiles[expectedPath], 'Файл должен быть создан');
      assert.strictEqual(
        this.mockFileSystem.createdFiles[expectedPath].trim(), 
        expectedContent.trim(),
        'Содержимое файла не соответствует ожидаемому'
      );
    }
  }
  
  const testInstance = new RelationDaoGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('должен сгенерировать relation dao файл для many-to-many отношения', async () => {
    // Подготавливаем тестовые данные
    const featurePath = path.join("test", "feature");
    const entityName = "task_tag_map";
    
    // Создаем мок для данных о связях
    const relation = {
      sourceTable: 'Task',
      targetTable: 'Tag',
      relationType: RelationType.MANY_TO_MANY,
      intermediateTable: 'TaskTagMap',
      sourceField: 'taskId',
      targetField: 'tagId'
    };
    
    // Добавляем пример в фабрику тестовых данных
    TestDataFactory.addExpectedContent('relation_dao', 'task_tag_map', taskTagMapDaoExample);
    
    // Вызываем генератор с тестовыми данными
    const generator = testInstance.createTestGenerator(testInstance.mockFileSystem);
    await generator.generate(featurePath, entityName, { relation });
    
    // Проверяем результат
    const expectedPath = testInstance.getTestExpectedPath(featurePath, entityName);
    const expectedContent = TestDataFactory.getExpectedContent('relation_dao', 'task_tag_map');
    
    testInstance.assertTestFileCreated(expectedPath, expectedContent);
  });
});