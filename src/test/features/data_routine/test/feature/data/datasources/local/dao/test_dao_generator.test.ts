import path from "path";
import { IFileSystem } from "../../../../../../../../../core/interfaces/file_system";
import { BaseDataRoutineGeneratorTest } from "../../../../../../generators/data_routine_generator.test";
import { FileGenerator } from "../../../../../../../../../core/interfaces/file_generator";
import { testCategoryDaoExample } from "./test_dao_example";
import { TestDaoGenerator } from "../../../../../../../../../features/data_routine/test/feature/data/datasources/local/dao/test_dao_generator";
import { PathData } from "../../../../../../../../../features/utils/path_util";


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
    
    const featureTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\data\\datasources\\local\\dao\\category_dao_test.dart"`;

    await testInstance.testGenerator(featureTestPath, "category", testCategoryDaoExample);
  });
});

