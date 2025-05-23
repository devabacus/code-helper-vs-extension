import path from "path";
import { FileGenerator } from "../../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../../core/interfaces/file_system";
import { TestLocalSourceGenerator } from "../../../../../../../../../features/data_routine/test/feature/data/datasources/local/sources/test_local_source_generator";
import { BaseDataRoutineGeneratorTest } from "../../../../../../generators/data_routine_generator.test";
import { testCategoryLocalSourceExample } from "./test_category_local_data_source_example";
import { testTaskLocalSourceExample } from "./test_task_local_data_source_example";


suite('TestLocalSourceGeneratorTest', () => {
  class TestLocalSourceGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestLocalSourceGenerator(fileSystem);
    }

    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "data", "datasources", "local", "sources", entityName, `${entityName}_local_data_source_test.dart`);
    }
  }

  const testInstance = new TestLocalSourceGeneratorTest();

  test('TestLocalSourceGeneratorTest', async () => {
    testInstance.setup();

    const featureTestCategoryPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\data\\datasources\\local\\sources\\category\\category_local_data_source_test.dart"`;
    const featureTestTaskPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\data\\datasources\\local\\sources\\category\\category_local_data_source_test.dart"`;

    await testInstance.testGenerator(featureTestCategoryPath, "category", testCategoryLocalSourceExample);
    await testInstance.testGenerator(featureTestTaskPath, "task", testTaskLocalSourceExample);
  });
});

