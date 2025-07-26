import { GENERATORS } from "../generators/section_generators";
import { Dictionaries } from "../replacement_util";

// Файлы, которые создаются для КАЖДОЙ YAML модели
export const entityManifest = {
  static: [],
  
  replace: [
    {
      files: ['data/datasources/local/interfaces/category_local_datasource_service.dart'],
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY]
    },
    {
      files: ['data/datasources/remote/interfaces/category_remote_datasource_service.dart'], 
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY]
    },
    {
      files: ['data/datasources/local/daos/category/category_dao.dart'], 
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY]
    },

  ],

  templated: [
    {
      file: 'data/datasources/local/tables/category_table.dart',
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY],
      generators: [
        GENERATORS.DRIFT_TABLE_COLUMNS
      ]
    },

     {
      file: 'data/models/category/category_model.dart',
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY],
      generators: [
        GENERATORS.FREEZED_CONSTRUCTOR
      ]
    },

    {
      file: 'data/datasources/local/tables/extensions/category_table_extension.dart',
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY],
      generators: [
        GENERATORS.SIMPLE_FIELDS,
        GENERATORS.VALUE_WRAPPED_FIELDS
    ]
    },

    {
      file: 'data/models/extensions/category_model_extension.dart',
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY],
      generators: [
        GENERATORS.SIMPLE_FIELDS,
        GENERATORS.VALUE_WRAPPED_FIELDS
    ]
    },
  ]
};