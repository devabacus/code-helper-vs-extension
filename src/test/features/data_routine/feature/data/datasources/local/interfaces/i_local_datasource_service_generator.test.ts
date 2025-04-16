import path from "path";
import { FileGenerator } from "../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { LocalDataSourceServiceGenerator } from "../../../../../../../../features/data_routine/feature/data/datasources/local/interfaces/i_local_datasource_service";
import { BaseDataRoutineGeneratorTest } from "../../../../../generators/data_routine_generator.test";
import { iLocalDatasourceServiceExample } from "./i_local_datasource_service_example";



suite('LocalDataSourceService', () => {

    class LocalDataSourceServiceTest extends BaseDataRoutineGeneratorTest {

        protected createGenerator(fileSystem: IFileSystem): FileGenerator {
            return new LocalDataSourceServiceGenerator(fileSystem);
        }
        protected getExpectedPath(featurePath: string, entityName: string): string {
            return path.join(featurePath, "data", "datasources", "local", "interfaces", `${entityName}_local_datasource_service.dart`);
        }

    }
    const testInstance = new LocalDataSourceServiceTest();

    test('must generate local_data_source_service', async () => {
        testInstance.setup();
        await testInstance.testGenerator(testInstance.defaultFeaturePath, "category", iLocalDatasourceServiceExample);
    });
});



