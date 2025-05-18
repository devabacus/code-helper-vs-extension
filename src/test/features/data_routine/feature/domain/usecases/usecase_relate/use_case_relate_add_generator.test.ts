import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { UseCaseRelateAddGenerator } from "../../../../../../../features/data_routine/feature/domain/usecases/relate/use_case_relate_add_target_to_source_generator";
import { toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { useCaseRelateAddFileExample } from "./use_case_relate_add_example";


suite('UseCaseRelateAddGenerator', () => {
    class UseCaseRelateAddGeneratorTest extends BaseDataRoutineGeneratorTest {

        protected createGenerator(fileSystem: IFileSystem): FileGenerator {
            return new UseCaseRelateAddGenerator(fileSystem);
        }

        protected getExpectedPath(featurePath: string, entityName: string): string {
            const snakeCaseEntityName = toSnakeCase(entityName);
            return path.join(featurePath, "domain", "usecases", snakeCaseEntityName, "add_target_to_source.dart");
        }
    }


    const testInstance = new UseCaseRelateAddGeneratorTest();
    setup(() => testInstance.setup());

    test('should generate add_<target>_to_<source>_use_case.dart for a many-to-many relation', async () => {
        await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", useCaseRelateAddFileExample);
    });
});