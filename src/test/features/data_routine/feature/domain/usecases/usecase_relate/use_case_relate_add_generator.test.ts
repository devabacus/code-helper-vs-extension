import path from "path";
import { FileGenerator } from "../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { toSnakeCase } from "../../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../../generators/data_routine_generator.test";
import { useCaseRelateAddFileExample } from "./use_case_relate_add_example";
import { DriftClassParser } from "../../../../../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../../../../../../features/data_routine/feature/data/datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../../../../../features/data_routine/interfaces/table_relation.interface";
import { UseCaseRelateAddGenerator } from "../../../../../../../features/data_routine/feature/domain/usecases/relate/use_case_relate_add_generator";


suite('UseCaseRelateAddGenerator', () => {
  class UseCaseRelateAddGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseRelateAddGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { 
         const snakeCaseEntityName = toSnakeCase(entityName);
         return path.join(featurePath, "domain", "usecases", snakeCaseEntityName, "add.dart");
       }
     }
 

  const testInstance = new UseCaseRelateAddGeneratorTest();
  setup(() => testInstance.setup());

  test('should generate add_<target>_to_<source>_use_case.dart for a many-to-many relation', async () => {
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", useCaseRelateAddFileExample);
  });
});