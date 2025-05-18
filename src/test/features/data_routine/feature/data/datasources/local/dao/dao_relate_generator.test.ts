// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { DataDaoRelateGenerator } from "../../../../../../../../features/data_routine/feature/data/datasources/local/dao/data_local_dao_relate_generator";
import { TestDataFactory } from "../../../../../fixtures/test_data_factory";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";



suite('DataDaoRelateGenerator', () => {
  class DataDaoRelateGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataDaoRelateGenerator(fileSystem);
    }
    
    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "data", "datasources", "local", "dao", entityName, `${entityName}_dao.dart`);
    }
  } 


  
  const testInstance = new DataDaoRelateGeneratorTest();
  
  setup(() => {
    testInstance.setup();
  });
  
  test('должен сгенерировать data dao файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('data_dao_relate', 'category');    
    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});;  