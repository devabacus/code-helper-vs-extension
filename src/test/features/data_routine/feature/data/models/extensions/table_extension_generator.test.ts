// src/test/features/data_routine/feature/domain/usecases/use_case_create_generator.test.ts
import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { TestDataFactory } from "../../../../fixtures/test_data_factory";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { DataExtensionTableGenerator } from "../../../../../../../features/data_routine/feature/data/models/extension_table_generator";


suite('DataExtensionTableGenerator', () => {
  class DataExtensionTableGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataExtensionTableGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "data", "models", "extensions", entityName, `${entityName}_table_extension.dart`);
    }
  }


  const testInstance = new DataExtensionTableGeneratorTest();

  setup(() => {
    testInstance.setup();
  });

  test('должен сгенерировать data table extension файл с правильным контентом', async () => {
    const featurePath = path.join("test", "feature");
    const entityName = "category";
    const expectedContent = TestDataFactory.getExpectedContent('table_extension', 'category');

    await testInstance.testGenerator(featurePath, entityName, expectedContent);
  });
});