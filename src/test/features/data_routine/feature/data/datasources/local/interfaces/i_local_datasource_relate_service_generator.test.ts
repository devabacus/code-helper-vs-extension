import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { DataLocalRelateDataSourceServiceGenerator } from "../../../../../../../../features/data_routine/feature/data/datasources/local/interfaces/i_local_relate_datasource_service";
import { toSnakeCase } from "../../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { iLocalDatasourceRelateServiceExample } from "./i_local_relate_datasource_service_example";


suite('DataLocalRelateDataSourceServiceGenerator', () => {
  class DataLocalRelateDataSourceServiceGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DataLocalRelateDataSourceServiceGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { // entityName here is "taskTagMap" (camelCase)
      const snakeCaseEntityName = toSnakeCase(entityName);
      return path.join(featurePath, "data", "datasources", "local", "interfaces", `i_${snakeCaseEntityName}_local_datasource_service.dart`);
    }
  }

  const testInstance = new DataLocalRelateDataSourceServiceGeneratorTest();

  setup(() => {
    testInstance.setup();
  });

  test('should generate i_local_relate_datasource_service.dart with correct content for a many-to-many relation', async () => {
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", iLocalDatasourceRelateServiceExample);
  });
});