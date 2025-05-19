import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { toSnakeCase, pluralConvert } from "../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { useCaseRelateGetSourcesWithTargetFileExample } from "./use_case_relate_source_with_target_example";
import { UseCaseRelateGetSourcesWithTargetGenerator } from "../../../../../../../features/data_routine/feature/domain/usecases/relate/use_case_relate_get_sources_with_target_generator";

suite('UseCaseRelateGetSourcesWithTargetGenerator', () => {
  class UseCaseRelateGetSourcesWithTargetGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseRelateGetSourcesWithTargetGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { 
        // Assuming entityName "taskTagMap" implies source "task" and target "tag"
        const sourceSnake = "task";
        const sourcePluralSnake = toSnakeCase(pluralConvert("Task")); // "tasks"
        const targetSnake = "tag";
        const useCaseSubDirSnake = `${sourceSnake}_${targetSnake}`; // "task_tag"
        const fileName = `get_${sourcePluralSnake}_with_${targetSnake}.dart`; // "get_tasks_with_tag.dart"

        return path.join(featurePath, "domain", "usecases", useCaseSubDirSnake, fileName);
       }
     }
 
  const testInstance = new UseCaseRelateGetSourcesWithTargetGeneratorTest();
  setup(() => testInstance.setup());

  // Updated test description
  test('should generate get_tasks_with_tag.dart for TaskTagMap relation', async () => {
    // Ensure testGenerator passes the correct Drift table content for "taskTagMap"
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", useCaseRelateGetSourcesWithTargetFileExample);
  });
});