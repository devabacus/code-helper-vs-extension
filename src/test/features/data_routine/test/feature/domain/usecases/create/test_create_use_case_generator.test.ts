import path from "path";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { TestCategoryCreateUseCaseExample } from "./test_category_create_usecase_example";
import { TestUseCaseCreateGenerator } from "../../../../../../../../features/data_routine/test/feature/domain/usecases/test_usecase_create_generator";
import { TestTaskCreateUseCaseExample } from "./test_task_create_usecase_example";


suite('TestLocalSourceGeneratorTest', () => {
  class TestUseCaseCreateGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new TestUseCaseCreateGenerator(fileSystem);
    }

    protected getExpectedPath(featureTestPath: string, entityName: string): string {
      return path.join(featureTestPath, "domain", "usecases", entityName, "crud", `${entityName}_create_usecase_test.dart`);
    }
  }

  const testInstance = new TestUseCaseCreateGeneratorTest();

  test('TestDaoGeneratorTest', async () => {
    testInstance.setup();

    const featureCategoryTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\category\\crud\\category_create_usecase_test.dart"`;
    const featureTaskTestPath = `"g:\\Projects\\Flutter\\project_name\\test\\features\\feature_name\\domain\\usecases\\task\\crud\\task_create_usecase_test.dart"`;

    await testInstance.testGenerator(featureCategoryTestPath, "category", TestCategoryCreateUseCaseExample);
    await testInstance.testGenerator(featureTaskTestPath, "task", TestTaskCreateUseCaseExample);
  });
});

