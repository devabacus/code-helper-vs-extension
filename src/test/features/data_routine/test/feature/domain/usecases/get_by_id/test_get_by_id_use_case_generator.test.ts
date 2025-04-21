import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { TestCategoryGetByIdUseCaseExample } from "./test_category_get_by_id_usecase_example";
import { TestTaskGetByIdUseCaseExample } from "./test_task_get_by_id_usecase_example";
import { TestUseCaseGetByIdGenerator } from "../../../../../../../../features/data_routine/test/feature/domain/usecases/test_usecase_get_by_id_generator";

suite('TestUseCaseGetByIdGeneratorTest', () => {
  class TestUseCaseGetByIdGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestUseCaseGetByIdGenerator(fileSystem);
    }

    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "domain", "usecases", entityName, "crud", `${entityName}_get_by_id_usecase_test.dart`);
    }
  }

  const testInstance = new TestUseCaseGetByIdGeneratorTest();

  test('TestDaoGeneratorTest', async () => {
    testInstance.setup();

    const featureCategoryTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\category\\crud\\category_get_by_id_usecase_test.dart"`;
    const featureTaskTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\task\\crud\\task_get_by_id_usecase_test.dart"`;

    await testInstance.testGenerator(featureCategoryTestPath, "category", TestCategoryGetByIdUseCaseExample);
    await testInstance.testGenerator(featureTaskTestPath, "task", TestTaskGetByIdUseCaseExample);
  });
});

