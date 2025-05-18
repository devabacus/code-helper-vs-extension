
import { DriftClassParser } from "../../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";

import { tableAuth, tableCategory, tableTask } from "../feature/data/datasources/local/tables/drift_class_examples";
import { tableTaskTagMapExample } from "../feature/data/datasources/local/tables/drift_relation_examples";
import { entityCategoryExample } from "../feature/domain/entities/entity_example";
import { useCaseCreateFileExample } from "../feature/domain/usecases/use_case_create_example";
import { useCaseDeleteExample } from "../feature/domain/usecases/use_case_delete_example";
import { useCaseGetAllExample } from "../feature/domain/usecases/use_case_get_all_example";
import { useCaseGetByIdExample } from "../feature/domain/usecases/use_case_get_by_id_example";
import { useCaseUpdateExample } from "../feature/domain/usecases/use_case_update_example";


import { dataDaoExample } from "../feature/data/datasources/local/dao/dao_class_example";
import { localDataSourceFileExample } from "../feature/data/datasources/local/sources/local_source_example";
import { dataProviderExample } from "../feature/data/providers/data_provider_example";

import { iLocalDatasourceServiceExample } from "../feature/data/datasources/local/interfaces/i_local_datasource_service_example";
import { modelExtensionCategoryExample } from "../feature/data/models/extensions/model_extension_example";
import { modelCategoryExample } from "../feature/data/models/model_example";
import { dataRepositoryImplCategoryExample } from "../feature/data/repositories/data_repository_impl_example";
import { entityExtensionCategoryExample } from "../feature/domain/entities/extensions/entity_extension_example";
import { useCaseCategoryProviderExample } from "../feature/domain/providers/use_case_prov_example";
import { domainRepostitoryExample } from "../feature/domain/repositories/domain_repository_example";
import { presentStateProviderCategoryExample } from "../feature/presentation/providers/present_state_prov_example";
import { useCaseWatchAllExample } from "../feature/domain/usecases/use_case_watch_all_example";
import { dataDaoRelateExample } from "../feature/data/datasources/local/dao/dao_relate_class_example";



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
      case 'taskTagMap': // Corrected to use the actual intermediate table definition
        return new DriftClassParser(tableTaskTagMapExample);
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

      case 'entity_extension_category':
        return entityExtensionCategoryExample;

      case 'domain_repository_category':
        return domainRepostitoryExample;

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

      case 'usecase_watch_all_category':
        return useCaseWatchAllExample;

      case 'usecase_providers_category':
        return useCaseCategoryProviderExample;

      // data layer
      case 'data_dao_category':
        return dataDaoExample;

      case 'data_dao_relate_task_tag_map':
        return dataDaoRelateExample;

      case 'data_local_data_source_service_category':
        return iLocalDatasourceServiceExample;

      case 'local_data_source_category':
        return localDataSourceFileExample;

      case 'data_repository_impl_category':
        return dataRepositoryImplCategoryExample;

      case 'model_category':
        return modelCategoryExample;

      case 'model_extension_category':
        return modelExtensionCategoryExample;

      // Provider генераторы
      case 'data_provider_category':
        return dataProviderExample;
      case 'presentation_provider_category':
        return presentStateProviderCategoryExample;

      default:
        throw new Error(`Неизвестная комбинация генератора и сущности: ${key}`);
    }
  }
}