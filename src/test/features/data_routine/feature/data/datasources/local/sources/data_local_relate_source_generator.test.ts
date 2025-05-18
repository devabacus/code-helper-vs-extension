import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { toSnakeCase } from "../../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { localDataSourceRelateFileExample } from "./local_source_relate_example";
import { DataLocalRelateSourceGenerator } from "../../../../../../../../features/data_routine/feature/data/datasources/local/sources/local_data_relate_source_generator";


suite('DataLocalRelateSourceGenerator', () => {
  class DataLocalRelateSourceGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataLocalRelateSourceGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { // entityName here is "taskTagMap" (camelCase)
      const snakeCaseEntityName = toSnakeCase(entityName);
      return path.join(featurePath, "data", "datasources", "local", "sources", `${snakeCaseEntityName}_local_data_source.dart`);
    }
  }

  const testInstance = new DataLocalRelateSourceGeneratorTest();

  setup(() => {
    testInstance.setup();
  });

  test('should generate <intermediate_table>_local_data_source.dart with correct content for a many-to-many relation', async () => {
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", localDataSourceRelateFileExample);
  });
});