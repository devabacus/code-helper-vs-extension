import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { useCaseRelateGetFileExample } from "./use_case_relate_get_example"; // Using the provided example content
import { UseCaseRelateGetTargetsForSourceGenerator } from "../../../../../../../features/data_routine/feature/domain/usecases/relate/use_case_relate_get_generator";


suite('UseCaseRelateGetTargetsForSourceGenerator', () => {
  class UseCaseRelateGetTargetsForSourceGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseRelateGetTargetsForSourceGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { 
         const snakeCaseEntityName = toSnakeCase(entityName); // e.g., task_tag_map
         return path.join(featurePath, "domain", "usecases", snakeCaseEntityName, "get_targets_for_source.dart");
       }
     }
 
  const testInstance = new UseCaseRelateGetTargetsForSourceGeneratorTest();
  setup(() => testInstance.setup());

  test('should generate get_targets_for_source.dart for a many-to-many relation', async () => {
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", useCaseRelateGetFileExample);
  });
});