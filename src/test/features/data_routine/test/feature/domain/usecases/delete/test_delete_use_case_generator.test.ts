import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { TestCategoryDeleteUseCaseExample } from "./test_category_delete_usecase_example";
import { TestTaskDeleteUseCaseExample } from "./test_task_delete_usecase_example";
import { TestUseCaseDeleteGenerator } from "../../../../../../../../features/data_routine/test/feature/domain/usecases/test_usecase_delete_generator";


suite('TestUseCaseDeleteGeneratorTest', () => {
  class TestUseCaseDeleteGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestUseCaseDeleteGenerator(fileSystem);
    }

    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "domain", "usecases", entityName, "crud", `${entityName}_delete_usecase_test.dart`);
    }
  }

  const testInstance = new TestUseCaseDeleteGeneratorTest();

  test('TestUseCaseDeleteGeneratorTest', async () => {
    testInstance.setup();

    const featureCategoryTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\category\\crud\\category_delete_usecase_test.dart"`;
    const featureTaskTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\task\\crud\\task_delete_usecase_test.dart"`;

    await testInstance.testGenerator(featureCategoryTestPath, "category", TestCategoryDeleteUseCaseExample);
    await testInstance.testGenerator(featureTaskTestPath, "task", TestTaskDeleteUseCaseExample);
  });
});

