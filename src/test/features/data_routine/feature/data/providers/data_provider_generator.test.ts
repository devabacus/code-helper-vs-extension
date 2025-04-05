// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { TestDataFactory } from "../../../fixtures/test_data_factory";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { DataProviderGenerator } from "../../../../../../features/data_routine/feature/data/providers/data_prov_generator";


suite('DataProviderGenerator', () => {
  class DataProviderGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataProviderGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "data", "providers", entityName, `${entityName}_data_providers.dart`);
    }
  }
  

  const testInstance = new DataProviderGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('должен сгенерировать data provider файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('data_provider', 'category');
    
    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});