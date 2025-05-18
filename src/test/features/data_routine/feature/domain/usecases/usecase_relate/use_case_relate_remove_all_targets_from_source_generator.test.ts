import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { useCaseRelateRemoveAllTargetFromSourceFileExample } from "./use_case_relate_remove_all_targets_from_source";
import { UseCaseRelateRemoveAllTargetsFromSourceGenerator } from "../../../../../../../features/data_routine/feature/domain/usecases/relate/use_case_relate_remove_all_targets_from_source_generator";

suite('UseCaseRelateRemoveAllTargetsFromSourceGenerator', () => {
  class UseCaseRelateRemoveAllTargetsFromSourceGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseRelateRemoveAllTargetsFromSourceGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { 
         const snakeCaseEntityName = toSnakeCase(entityName); // e.g., task_tag_map
         return path.join(featurePath, "domain", "usecases", snakeCaseEntityName, "remove_all_targets_from_source.dart");
       }
     }
 
  const testInstance = new UseCaseRelateRemoveAllTargetsFromSourceGeneratorTest();
  setup(() => testInstance.setup());

  test('should generate remove_all_targets_from_source.dart for a many-to-many relation', async () => {
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", useCaseRelateRemoveAllTargetFromSourceFileExample);
  });
});