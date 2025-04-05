// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { TestDataFactory } from "../../../../fixtures/test_data_factory";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { DomainExtensionEntityGenerator } from "../../../../../../../features/data_routine/feature/domain/entities/entity_extension_generator";


suite('DomainExtensionEntityGenerator', () => {
  class DomainExtensionEntityGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DomainExtensionEntityGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "domain", "entities", "extensions", `${entityName}_entity_extension.dart`);
    }
  }


  const testInstance = new DomainExtensionEntityGeneratorTest();

  setup(() => {
    testInstance.setup();
  });

  test('должен сгенерировать data entity extension файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('entity_extension', 'category');

    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});