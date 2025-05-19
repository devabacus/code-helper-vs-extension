import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { toSnakeCase, pluralConvert } from "../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { useCaseRelateRemoveAllTargetFromSourceFileExample } from "./use_case_relate_remove_all_targets_from_source";
import { UseCaseRelateRemoveAllTargetsFromSourceGenerator } from "../../../../../../../features/data_routine/feature/domain/usecases/relate/use_case_relate_remove_all_targets_from_source_generator";

suite('UseCaseRelateRemoveAllTargetsFromSourceGenerator', () => {
  class UseCaseRelateRemoveAllTargetsFromSourceGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseRelateRemoveAllTargetsFromSourceGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { 
        // Assuming entityName "taskTagMap" implies source "task" and target "tag"
        const sourceSnake = "task";
        const targetSnake = "tag";
        const targetPluralSnake = toSnakeCase(pluralConvert("Tag")); // "tags"
        const useCaseSubDirSnake = `${sourceSnake}_${targetSnake}`;   // "task_tag"
        const fileName = `remove_all_${targetPluralSnake}_from_${sourceSnake}.dart`; // "remove_all_tags_from_task.dart"

        return path.join(featurePath, "domain", "usecases", useCaseSubDirSnake, fileName);
       }
     }
 
  const testInstance = new UseCaseRelateRemoveAllTargetsFromSourceGeneratorTest();
  setup(() => testInstance.setup());

  // Updated test description
  test('should generate remove_all_tags_from_task.dart for TaskTagMap relation', async () => {
    // Ensure testGenerator passes the correct Drift table content for "taskTagMap"
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", useCaseRelateRemoveAllTargetFromSourceFileExample);
  });
});