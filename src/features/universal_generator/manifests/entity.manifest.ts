import { DictionaryPresets } from "../dictionary_presets"; // <-- Импортируем пресеты
import { GENERATORS } from "../generators/section_generators";
import { CustomFileGroup } from "./type";



export const entityManifest = {

    defaultEntityFiles: {
        dictionaries: DictionaryPresets.ENTITY,

        replace: [
            // 'data/datasources/local/interfaces/category_local_datasource_service.dart',
            // 'data/datasources/remote/interfaces/category_remote_datasource_service.dart',
            // 'data/datasources/local/interfaces/category_local_datasource_service.dart',
            // 'data/datasources/remote/interfaces/category_remote_datasource_service.dart',
            // 'data/datasources/remote/sources/category_remote_data_source.dart',
            'data/providers/category/category_data_providers.dart',
            'data/repositories/category_repository_impl.dart',
            'domain/providers/category/category_usecase_providers.dart',
            'domain/repositories/category_repository.dart',
            'domain/usecases/category_usecases.dart',
            'presentation/providers/category/category_get_by_id_provider.dart',
            'presentation/providers/category/category_state_providers.dart',
            'server/lib/src/endpoints/category_endpoint.dart'
        ],

        templated: [
            {
                file: 'data/datasources/local/daos/category/category_dao.dart',
                generators: [GENERATORS.DAO_RELATION_METHODS]
            },
            {
                file: 'data/datasources/local/datasources/category_local_data_source.dart',
                generators: [
                    GENERATORS.LOCAL_DATASOURCE_RELATION_METHODS
                ]
            },
            {
                file: 'data/datasources/local/interfaces/category_local_datasource_service.dart',
                generators: [GENERATORS.LOCAL_DATASOURCE_SERVICE_RELATION_METHODS]
            },
            {
                file: 'data/datasources/remote/interfaces/category_remote_datasource_service.dart',
                generators: [GENERATORS.REMOTE_DATASOURCE_SERVICE_RELATION_METHODS]
            },
            {
                file: 'data/datasources/remote/sources/category_remote_data_source.dart',
                generators: [GENERATORS.REMOTE_DATASOURCE_RELATION_METHODS]
            },
            {
                file: 'data/datasources/local/tables/category_table.dart',
                generators: [GENERATORS.DRIFT_TABLE_IMPORTS, GENERATORS.DRIFT_TABLE_COLUMNS]
            },
            {
                file: 'data/models/category/category_model.dart',
                generators: [GENERATORS.FREEZED_CONSTRUCTOR]
            },
            {
                file: 'data/datasources/local/tables/extensions/category_table_extension.dart',
                generators: [
                    GENERATORS.SIMPLE_FIELDS,
                    GENERATORS.VALUE_WRAPPED_FIELDS
                ]
            },
            {
                file: 'data/models/extensions/category_model_extension.dart',
                generators: [
                    GENERATORS.SIMPLE_FIELDS,
                    GENERATORS.VALUE_WRAPPED_FIELDS
                ]
            },
            {
                file: 'domain/entities/category/category_entity.dart',
                generators: [GENERATORS.FREEZED_CONSTRUCTOR]
            },
            {
                file: 'domain/entities/extensions/category_entity_extension.dart',
                generators: [
                    GENERATORS.SIMPLE_FIELDS,
                    GENERATORS.SIMPLE_FIELDS,
                ]
            }
        ]
    },

    /**
     * Сюда можно будет добавлять файлы с особыми правилами замены,
     * если они не вписываются в стандартный поток.
     * Например: { files: ['...'], dictionaries: DictionaryPresets.PROJECT_ONLY }
     */
    customFiles: [] as CustomFileGroup[]
};