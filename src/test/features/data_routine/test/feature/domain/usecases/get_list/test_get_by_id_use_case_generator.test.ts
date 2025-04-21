import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { TestCategoryGetListUseCaseExample } from "./test_category_get_list_usecase_example";
import { TestUseCaseGetListGenerator } from "../../../../../../../../features/data_routine/test/feature/domain/usecases/test_usecase_get_list_generator";
import { TestTaskGetListUseCaseExample } from "./test_task_get_list_usecase_example";

suite('TestUseCaseGetListGeneratorTest', () => {
  class TestUseCaseGetListGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestUseCaseGetListGenerator(fileSystem);
    }

    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "domain", "usecases", entityName, "crud", `${entityName}_get_list_usecase_test.dart`);
    }
  }

  const testInstance = new TestUseCaseGetListGeneratorTest();

  test('TestDaoGeneratorTest', async () => {
    testInstance.setup();

    const featureCategoryTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\category\\crud\\category_get_list_usecase_test.dart"`;
    const featureTaskTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\task\\crud\\task_get_list_usecase_test.dart"`;

    await testInstance.testGenerator(featureCategoryTestPath, "category", TestCategoryGetListUseCaseExample);
    await testInstance.testGenerator(featureTaskTestPath, "task", TestTaskGetListUseCaseExample);
  });
});

