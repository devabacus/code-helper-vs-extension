import { DictionaryPresets } from "../dictionary_presets";
import { CustomFileGroup } from "./type"; // <-- Важно импортировать тип

export const manyToManyManifest = {
  // Удаляем ключи replace и dictionaries с верхнего уровня
  
  // Вместо них используем customFiles
  customFiles: [
    {
      // Все файлы, которые нужно обработать для M2M-связи
      files: [
        'data/datasources/local/daos/task_tag_map/task_tag_map_dao.dart',
        'data/datasources/local/datasources/task_tag_map_local_data_source.dart',
        'data/datasources/local/interfaces/task_tag_map_local_datasource_service.dart',

      ],
      // Словарь, который нужно применить к этой группе файлов
      dictionaries: DictionaryPresets.M2M
    }
  ] as CustomFileGroup[], // <-- Явно указываем тип для строгости

  // Оставляем templated пустым, если он не нужен
  templated: []
};