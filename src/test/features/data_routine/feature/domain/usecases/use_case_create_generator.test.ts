// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { UseCaseCreateGenerator } from "../../../../../../features/data_routine/feature/domain/usecases/use_case_create_generator";
import { TestDataFactory } from "../../../fixtures/test_data_factory";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";

suite('UseCaseCreateGenerator', () => {
  class UseCaseCreateGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseCreateGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "domain", "usecases", entityName, "create.dart");
    }
  }
  
  const testInstance = new UseCaseCreateGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('должен сгенерировать use_case_create файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('usecase_create', 'category');
    
    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});