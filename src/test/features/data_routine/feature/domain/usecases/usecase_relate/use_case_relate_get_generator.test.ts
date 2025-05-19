import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { toSnakeCase, pluralConvert } from "../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { useCaseRelateGetFileExample } from "./use_case_relate_get_example"; // Using the provided example content
import { UseCaseRelateGetTargetsForSourceGenerator } from "../../../../../../../features/data_routine/feature/domain/usecases/relate/use_case_relate_get_targets_for_source_generator";


suite('UseCaseRelateGetTargetsForSourceGenerator', () => {
  class UseCaseRelateGetTargetsForSourceGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseRelateGetTargetsForSourceGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string {
      // Assuming entityName "taskTagMap" implies source "task" and target "tag"
      const sourceSnake = "task";
      const targetSnake = "tag";
      const targetPluralSnake = toSnakeCase(pluralConvert("Tag")); // "tags"
      const useCaseSubDirSnake = `${sourceSnake}_${targetSnake}`; // "task_tag"
      const fileName = `get_${targetPluralSnake}_for_${sourceSnake}.dart`; // "get_tags_for_task.dart"

      return path.join(featurePath, "domain", "usecases", useCaseSubDirSnake, fileName);
    }
  }

  const testInstance = new UseCaseRelateGetTargetsForSourceGeneratorTest();
  setup(() => testInstance.setup());

  // Updated test description
  test('should generate get_tags_for_task.dart for TaskTagMap relation', async () => {
    // Ensure testGenerator passes the correct Drift table content for "taskTagMap"
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", useCaseRelateGetFileExample);
  });
});