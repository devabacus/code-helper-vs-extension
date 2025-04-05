// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { DataSourcesGenerator } from "../../../../../../../../features/data_routine/feature/data/datasources/local/sources/local_data_source_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { TestDataFactory } from "../../../../../fixtures/test_data_factory";



suite('DataSourcesGenerator', () => {
  class DataSourcesGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataSourcesGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "data", "datasources", "local", "sources", `${entityName}_local_data_source.dart`);
    }
  }
  

  const testInstance = new DataSourcesGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('должен сгенерировать data local_data_source файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('local_data_source', 'category');
    
    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});