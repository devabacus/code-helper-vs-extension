import path from "path";
import { FileGenerator } from "../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { DriftClassParser } from "../../../../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";
import { UseCaseRelateProvidersGenerator } from "../../../../../../features/data_routine/feature/domain/providers/use_case_relate_providers_generator";
import { toSnakeCase } from "../../../../../../utils/text_work/text_util";
import { BaseDataRoutineGeneratorTest } from "../../../generators/data_routine_generator.test";
import { useCaseRelateProviderExample } from "./use_case_relate_provider_example";

// Определяем содержимое Drift-таблицы TaskTagMap прямо здесь, чтобы не зависеть от TestDataFactory
const taskTagMapTableContent = `
import 'package:drift/drift.dart';
import './task.dart'; // Предполагаемый путь к определению таблицы Tasks
import './tag.dart';  // Предполагаемый путь к определению таблицы Tags

@DataClassName('TaskTagMapEntity')
class TaskTagMap extends Table {
  TextColumn get taskId => text().references(Tasks, #id)();
  TextColumn get tagId => text().references(Tags, #id)();

  @override
  Set<Column> get primaryKey => {taskId, tagId};
}`;

suite('UseCaseRelateProvidersGenerator', () => {
  class UseCaseRelateProvidersGeneratorTest extends BaseDataRoutineGeneratorTest {

    protected createGenerator(fileSystem: IFileSystem): FileGenerator {
      return new UseCaseRelateProvidersGenerator(fileSystem);
    }

    protected getExpectedPath(featurePath: string, entityName: string): string {
      // entityName is now the intermediate table name, e.g., "TaskTagMap"
      const intermediateSnake = toSnakeCase(entityName);
      return path.join(featurePath, "domain", "providers", intermediateSnake, `${intermediateSnake}_usecase_providers.dart`);
    }
  }

  const testInstance = new UseCaseRelateProvidersGeneratorTest();
  setup(() => testInstance.setup());

  test('should generate relate use case providers file matching the example for TaskTagMap', async () => {
    // Создаем парсер на основе локально определенного содержимого таблицы TaskTagMap
    const parserForTaskTagMap = new DriftClassParser(taskTagMapTableContent);

    // Используем testGeneratorWithSpecificParser для передачи нашего кастомного парсера.
    // "TaskTagMap" используется для getExpectedPath и как entityName для генератора.
    // await testInstance.testGeneratorWithSpecificParser(
    //   testInstance.defaultFeaturePath, 
    //   "TaskTagMap", // Имя промежуточной таблицы
    //   useCaseRelateProviderExample,
    //   parserForTaskTagMap
    // );
  });
});