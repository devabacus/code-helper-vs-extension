
import { DriftClassParser } from "../../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";

import { tableCategory, tableTask, tableAuth } from "../feature/data/datasources/local/tables/drift_class_examples";

import { entityCategoryExample } from "../feature/domain/entities/entity_example";
import { useCaseCreateFileExample } from "../feature/domain/usecases/use_case_create";
import { useCaseDeleteExample } from "../feature/domain/usecases/use_case_delete";
import { useCaseUpdateExample } from "../feature/domain/usecases/use_case_update";
import { useCaseGetAllExample } from "../feature/domain/usecases/use_case_get_all";
import { useCaseGetByIdExample } from "../feature/domain/usecases/use_case_get_by_id";


import { daoClassExample } from "../feature/data/datasources/local/dao/dao_class_example";
import { localSourceFileExample } from "../feature/data/datasources/local/sources/local_source_example";
import { dataProviderExample } from "../feature/data/providers/data_prov_example";

import { presentStateProvCategoryExample } from "../feature/presentation/providers/present_state_prov_example";



export class TestDataFactory {
  /**
   * Создает и возвращает парсер для заданного типа сущности
   */
  static createDriftClassParser(entityType: string): DriftClassParser {
    switch (entityType) {
      case 'category':
        return new DriftClassParser(tableCategory);
      case 'task':
        return new DriftClassParser(tableTask);
      case 'auth':
        return new DriftClassParser(tableAuth);
      default:
        throw new Error(`Неизвестный тип сущности: ${entityType}`);
    }
  }

  /**
   * Возвращает ожидаемый контент для заданного типа генератора и сущности
   */
  static getExpectedContent(generatorType: string, entityType: string): string {
    const key = `${generatorType}_${entityType}`;

    switch (key) {
      // Entity генераторы
      case 'entity_category':
        return entityCategoryExample;

      // UseCase генераторы
      case 'usecase_create_category':
        return useCaseCreateFileExample;
      case 'usecase_delete_category':
        return useCaseDeleteExample;
      case 'usecase_update_category':
        return useCaseUpdateExample;
      case 'usecase_get_all_category':
        return useCaseGetAllExample;
      case 'usecase_get_by_id_category':
        return useCaseGetByIdExample;

      // DAO генераторы
      case 'dao_category':
        return daoClassExample;

      // LocalDataSource генераторы
      case 'local_data_source_category':
        return localSourceFileExample;

      // Provider генераторы
      case 'data_provider_category':
        return dataProviderExample;
      case 'presentation_provider_category':
        return presentStateProvCategoryExample;

      default:
        throw new Error(`Неизвестная комбинация генератора и сущности: ${key}`);
    }
  }
}