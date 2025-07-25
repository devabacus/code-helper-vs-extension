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
  ],

  templated: [
    {
      file: 'data/datasources/local/tables/category_table.dart',
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY],
      sections: [{
        startMarker: '// === GENERATED_START ===',
        endMarker: '// === GENERATED_END ===',
        generator: GENERATORS.DRIFT_TABLE_COLUMNS
      }]
    },

    {
      file: 'data/datasources/local/tables/extensions/category_table_extension.dart',
      dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY],
      sections: [
        
        {
        startMarker: '// === GENERATED_SIMPLE_START ===',
        endMarker: '// === GENERATED_SIMPLE_END ===',
        generator: GENERATORS.SIMPLE_FIELDS
      },
       {
        startMarker: '// === GENERATED_WRAPPED_START ===',
        endMarker: '// === GENERATED_WRAPPED_END ===',
        generator: GENERATORS.VALUE_WRAPPED_FIELDS
      }
    ]
    },
    // {
    //   file: 'data/datasources/local/dao/category_dao.dart',
    //   dictionaries: [Dictionaries.COMMON, Dictionaries.ENTITY],
    //   sections: [{
    //     startMarker: '// === GENERATED_DAO_METHODS_START ===',
    //     endMarker: '// === GENERATED_DAO_METHODS_END ===',
    //     generator: GENERATORS.DAO_METHODS
    //   }]
    // }
    // ... другие файлы специфичные для сущности
  ]
};