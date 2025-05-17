import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { TestUseCaseWatchGenerator } from "../../../../../../../../features/data_routine/test/feature/domain/usecases/test_usecase_watch_generator";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { TestCategoryWatchUseCaseExample } from "../watch/test_category_watch_usecase_example";
import { TestTaskWatchUseCaseExample } from "./test_task_watch_usecase_example";

suite('TestWatchGeneratorTest', () => {
  class TestUseCaseWatchGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestUseCaseWatchGenerator(fileSystem);
    }

    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "domain", "usecases", entityName, "crud", `${entityName}_watch_usecase_test.dart`);
    }
  }

  const testInstance = new TestUseCaseWatchGeneratorTest();

  test('TestWatchGeneratorTest', async () => {
    testInstance.setup();

    const featureCategoryTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\category\\crud\\category_watch_usecase_test.dart"`;
    const featureTaskTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\task\\crud\\task_watch_usecase_test.dart"`;

    await testInstance.testGenerator(featureCategoryTestPath, "category", TestCategoryWatchUseCaseExample);
    await testInstance.testGenerator(featureTaskTestPath, "task", TestTaskWatchUseCaseExample);
  });
});

