// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { UseCaseProvidersGenerator } from "../../../../../../features/data_routine/feature/domain/providers/usecase_providers_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { TestDataFactory } from "../../../fixtures/test_data_factory";



suite('UseCaseProvidersGenerator', () => {
  class UseCaseProvidersGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseProvidersGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "domain", "providers", entityName, `${entityName}_usecase_providers.dart`);
    }
  }

  const testInstance = new UseCaseProvidersGeneratorTest();

  setup(() => {
    testInstance.setup();
  });

  test('должен сгенерировать use case providers файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('usecase_providers', 'category');

    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});