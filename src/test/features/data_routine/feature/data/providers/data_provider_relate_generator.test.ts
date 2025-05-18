import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { DataProviderRelateGenerator } from "../../../../../../features/data_routine/feature/data/providers/data_provider_relate_generator";
import { toSnakeCase } from "../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { dataProviderRelateExample } from "./data_provider_relate_example";


suite('DataProviderRelateGenerator', () => {
  class DataProviderRelateGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataProviderRelateGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { // entityName here is "taskTagMap" (camelCase)
      const snakeCaseEntityName = toSnakeCase(entityName);
      // data_provider_generator places providers in a subfolder named after the entity
      return path.join(featurePath, "data", "providers", snakeCaseEntityName, `${snakeCaseEntityName}_data_providers.dart`);
    }
  }

  const testInstance = new DataProviderRelateGeneratorTest();

  setup(() => testInstance.setup());

  test('should generate <intermediate_table>_data_providers.dart for a many-to-many relation', async () => {
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", dataProviderRelateExample);
  });
});