import path from "path";
import { FileGenerator } from "../../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../../core/interfaces/file_system";
import { TestDaoGenerator } from "../../../../../../../../../features/data_routine/test/feature/data/datasources/local/dao/test_dao_generator";
import { BaseDataRoutineGeneratorTest } from "../../../../../../generators/data_routine_generator.test";
import { testCategorLocalSourceExample } from "./test_local_data_source_example";
import { TestLocalSourceGenerator } from "../../../../../../../../../features/data_routine/test/feature/data/datasources/local/sources/test_local_source_generator";


suite('TestLocalSourceGeneratorTest', () => {
  class TestLocalSourceGeneratorTest extends BaseDataRoutineGeneratorTest {
   
    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestLocalSourceGenerator(fileSystem);
    }
    
    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "data", "datasources", "local","sources", `${entityName}_local_data_source_test.dart`);
    }
  }
  
  const testInstance = new TestLocalSourceGeneratorTest();
  
  test('TestDaoGeneratorTest', async () => {
    testInstance.setup();
    
    const featureTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\data\\datasources\\local\\sources\\category_local_data_source_test.dart"`;

    await testInstance.testGenerator(featureTestPath, "category", testCategorLocalSourceExample);
  });
});

