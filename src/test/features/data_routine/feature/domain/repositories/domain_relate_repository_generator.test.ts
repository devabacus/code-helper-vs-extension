import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { DomainRelateRepositoryGenerator } from "../../../../../../features/data_routine/feature/domain/repositories/domain_relate_repository_generator";
import { toSnakeCase } from "../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { domainRelateRepostitoryExample } from "./domain_relate_repository_example";


suite('DomainRelateRepositoryGenerator', () => {
  class DomainRelateRepositoryGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new DomainRelateRepositoryGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string { // entityName here is "taskTagMap" (camelCase)
      const snakeCaseEntityName = toSnakeCase(entityName);
      return path.join(featurePath, "domain", "repositories", `${snakeCaseEntityName}_repository.dart`);
    }
  }

  const testInstance = new DomainRelateRepositoryGeneratorTest();

  setup(() => testInstance.setup());

  test('should generate repository.dart for a many-to-many relation', async () => {
    await testInstance.testGenerator(testInstance.defaultFeaturePath, "taskTagMap", domainRelateRepostitoryExample);
  });
});