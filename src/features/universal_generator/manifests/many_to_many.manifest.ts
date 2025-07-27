import { DictionaryPresets } from "../dictionary_presets";
import { Dictionaries } from "../replacement_util";


export const manyToManyManifest = {
  // Файлы, которые нужно просто скопировать и заменить в них названия
  replace: [
      'data/datasources/local/daos/maps/task_tag_map_dao.dart',
    // 'data/datasources/local/tables/maps/task_tag_map_table.dart',
    // ... любые другие файлы, относящиеся к связующей таблице
  ],

  // Используем наш новый пресет
  dictionaries: DictionaryPresets.M2M,
};