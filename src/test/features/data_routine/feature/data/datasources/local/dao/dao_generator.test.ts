// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { TestDataFactory } from "../../../../../fixtures/test_data_factory";
import { DataDaoGenerator } from "../../../../../../../../features/data_routine/feature/data/datasources/local/dao/data_local_dao_generator";



suite('DataDaoGenerator', () => {
  class DataDaoGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataDaoGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "data", "datasources", "local", "dao", entityName, `${entityName}_dao.dart`);
    }
  } 


  
  const testInstance = new DataDaoGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('должен сгенерировать data dao файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('data_dao', 'category');    
    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});;  