import { GENERATORS } from "../generators/section_generators";
import { DictionaryPresets } from "../dictionary_presets"; // <-- Импортируем пресеты
import { DictionaryName } from "../replacement_util";

interface CustomFileGroup {
  files: string[];
  dictionaries: readonly DictionaryName[];
}

export const entityManifest = {

    defaultEntityFiles: {
        dictionaries: DictionaryPresets.ENTITY,
        
        replace: [
            'data/datasources/local/interfaces/category_local_datasource_service.dart',
            'data/datasources/remote/interfaces/category_remote_datasource_service.dart',
            'data/datasources/local/daos/category/category_dao.dart',
            'data/datasources/local/datasources/category_local_data_source.dart',
            'data/datasources/local/interfaces/category_local_datasource_service.dart',
            'data/datasources/remote/interfaces/category_remote_datasource_service.dart',
            'data/datasources/remote/sources/category_remote_data_source.dart'
        ],

        templated: [
            {
                file: 'data/datasources/local/tables/category_table.dart',
                generators: [GENERATORS.DRIFT_TABLE_COLUMNS]
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
        ]
    },

    /**
     * Сюда можно будет добавлять файлы с особыми правилами замены,
     * если они не вписываются в стандартный поток.
     * Например: { files: ['...'], dictionaries: DictionaryPresets.PROJECT_ONLY }
     */
    customFiles: [] as CustomFileGroup[]
};