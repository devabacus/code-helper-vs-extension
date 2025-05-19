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
            // Assuming entityName "taskTagMap" implies source "task" and target "tag"
            // This logic should align with how RelateDataRoutineGenerator derives these.
            const sourceSnake = "task";
            const targetSnake = "tag";
            const useCaseSubDirSnake = `${sourceSnake}_${targetSnake}`; // "task_tag"
            const fileName = `add_${targetSnake}_to_${sourceSnake}.dart`; // "add_tag_to_task.dart"
            
            return path.join(featurePath, "domain", "usecases", useCaseSubDirSnake, fileName);
        }
    }


    const testInstance = new UseCaseRelateAddGeneratorTest();
    setup(() => testInstance.setup());
    // Updated test description to reflect the specific file name for TaskTagMap
    test('should generate add_tag_to_task.dart for TaskTagMap relation', async () => {
        // Ensure testGenerator passes the correct Drift table content for "taskTagMap"
        await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", useCaseRelateAddFileExample);
    });
});