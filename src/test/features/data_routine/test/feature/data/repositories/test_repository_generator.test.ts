import path from "path";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { testCategoryRepostitoryImplExample } from "./test_repository_impl_example";
import { TestRepositoryImplGenerator } from "../../../../../../../features/data_routine/test/feature/data/repositories/test_repository_impl_generator";


suite('TestLocalSourceGeneratorTest', () => {
  class TestRepositoryGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestRepositoryImplGenerator(fileSystem);
    }

    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "data", "repositories", entityName, `${entityName}_repository_impl_test.dart`);
    }
  }

  const testInstance = new TestRepositoryGeneratorTest();

  test('TestDaoGeneratorTest', async () => {
    testInstance.setup();

    const featureTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\data\\repositories\\category\\category_repository_impl_test.dart"`;

    await testInstance.testGenerator(featureTestPath, "category", testCategoryRepostitoryImplExample);
  });
});

