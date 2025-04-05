// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { TestDataFactory } from "../../../fixtures/test_data_factory";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { DomainRepositoryGenerator } from "../../../../../../features/data_routine/feature/domain/repositories/domain_repository_generator";


suite('DomainRepositoryGenerator', () => {
  class DomainRepositoryGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DomainRepositoryGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "domain", "repositories", `${entityName}_repository.dart`);
    }
  }
  
  const testInstance = new DomainRepositoryGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('должен сгенерировать domain repository файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('domain_repository', 'category');
    
    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});