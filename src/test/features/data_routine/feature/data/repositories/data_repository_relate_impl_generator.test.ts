import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { DataRepositoryRelateImplGenerator } from "../../../../../../features/data_routine/feature/data/repositories/data_repository_relate_impl_generator";
import { toSnakeCase } from "../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { dataRepositoryRelateImplCategoryExample } from "./data_repository_relate_impl_example";


suite('DataRepositoryRelateImplGenerator', () => {
  class DataRepositoryRelateImplGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataRepositoryRelateImplGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { // entityName here is "taskTagMap" (camelCase)
      const snakeCaseEntityName = toSnakeCase(entityName);
      return path.join(featurePath, "data", "repositories", `${snakeCaseEntityName}_repository_impl.dart`);
    }
  }

  const testInstance = new DataRepositoryRelateImplGeneratorTest();

  setup(() => testInstance.setup());

  test('should generate <intermediate_table>_repository_impl.dart for a many-to-many relation', async () => {
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", dataRepositoryRelateImplCategoryExample);
  });
});