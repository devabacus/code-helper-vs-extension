// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { TestDataFactory } from "../../../fixtures/test_data_factory";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { PresentProviderGenerator } from "../../../../../../features/data_routine/feature/presentation/providers/present_prov_generator";


suite('PresentProviderGenerator', () => {
  class PresentProviderGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new PresentProviderGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "presentation", "providers", entityName, `${entityName}_state_providers.dart`);
    }
  }
  

  const testInstance = new PresentProviderGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('должен сгенерировать presentation state provider файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('presentation_provider', 'category');
    
    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});