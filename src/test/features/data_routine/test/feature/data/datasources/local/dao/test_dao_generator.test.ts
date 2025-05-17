import path from "path";
import { FileGenerator } from "../../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../../core/interfaces/file_system";
import { TestDaoGenerator } from "../../../../../../../../../features/data_routine/test/feature/data/datasources/local/dao/test_dao_generator";
import { BaseDataRoutineGeneratorTest } from "../../../../../../generators/data_routine_generator.test";
import { testCategoryDaoExample } from "./category_test_dao_example";
import { testTaskDaoExample } from "./task_test_dao_example";


suite('TestDaoGeneratorTest', () => {
  class TestDaoGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestDaoGenerator(fileSystem);
    }
    
    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "data", "datasources", "local","dao", `${entityName}_dao_test.dart`);
    }
  }
       
  const testInstance = new TestDaoGeneratorTest();
  
  test('TestDaoGeneratorTest', async () => {
    testInstance.setup();
    
    const featureCategoryTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\data\\datasources\\local\\dao\\category\\category_dao_test.dart"`;
    const featureTaskTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\data\\datasources\\local\\dao\\task\\task_dao_test.dart"`;

    await testInstance.testGenerator(featureCategoryTestPath, "category", testCategoryDaoExample);
    await testInstance.testGenerator(featureTaskTestPath, "task", testTaskDaoExample);
  });
});

