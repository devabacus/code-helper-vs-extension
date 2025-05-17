import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { TestCategoryUpdateUseCaseExample } from "./test_category_update_usecase_example";
import { TestTaskUpdateUseCaseExample } from "./test_task_update_usecase_example";
import { TestUseCaseUpdateGenerator } from "../../../../../../../../features/data_routine/test/feature/domain/usecases/test_usecase_update_generator";
import { TestCategoryWatchUseCaseExample } from "../watch/test_category_watch_usecase_example";

suite('TestUpdateGeneratorTest', () => {
  class TestUseCaseUpdateGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestUseCaseUpdateGenerator(fileSystem);
    }

    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "domain", "usecases", entityName, "crud", `${entityName}_update_usecase_test.dart`);
    }
  }

  const testInstance = new TestUseCaseUpdateGeneratorTest();

  test('TestLocalUpdateGeneratorTest', async () => {
    testInstance.setup();

    const featureCategoryTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\category\\crud\\category_update_usecase_test.dart"`;
    const featureTaskTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\task\\crud\\task_update_usecase_test.dart"`;
-
    await testInstance.testGenerator(featureCategoryTestPath, "category", TestCategoryUpdateUseCaseExample);
    await testInstance.testGenerator(featureTaskTestPath, "task", TestTaskUpdateUseCaseExample);
  });
});

