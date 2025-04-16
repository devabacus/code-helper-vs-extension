import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { PresentGetByIdProviderExample } from "./present_get_by_id_provider_example";
import { PresentGetByIdProviderGenerator } from "../../../../../../features/data_routine/feature/presentation/providers/present_get_by_id_prov_generator";


suite('PresentGetByIdProviderGenerator', () => {
  class PresentGetByIdProviderGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new PresentGetByIdProviderGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string {
      return path.join(featurePath, "presentation", "providers", entityName, `${entityName}_get_by_id_provider.dart`);
    }
  }

  const testInstance = new PresentGetByIdProviderGeneratorTest();

  test('PresentGetByIdProviderGenerator', async () => {
    testInstance.setup();
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "category", PresentGetByIdProviderExample);
  });
});