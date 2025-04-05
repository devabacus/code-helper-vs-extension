// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { TestDataFactory } from "../../../fixtures/test_data_factory";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { DataRepositoryGenerator } from "../../../../../../features/data_routine/feature/data/repositories/data_repository_generator";


suite('DataRepositoryGenerator', () => {
  class DataRepositoryGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataRepositoryGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "data", "repositories", `${entityName}_repository_impl.dart`);
    }
  }
  

  const testInstance = new DataRepositoryGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('data repository impl', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('data_repository_impl', 'category');
    
    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});