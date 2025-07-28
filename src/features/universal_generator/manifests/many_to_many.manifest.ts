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
        'data/datasources/local/tables/task_tag_map_table.dart',
        'data/datasources/local/tables/extensions/task_tag_map_table_extension.dart',
        'data/datasources/remote/interfaces/task_tag_map_remote_datasource_service.dart',
        'data/datasources/remote/sources/task_tag_map_remote_data_source.dart',
        'data/models/task_tag_map/task_tag_map_model.dart',
        'data/models/extensions/task_tag_map_model_extension.dart',
        'data/providers/task_tag_map/task_tag_map_data_providers.dart',
        'data/repositories/task_tag_map_repository_impl.dart',
        'domain/entities/task_tag_map/task_tag_map_entity.dart',
        'domain/entities/extensions/task_tag_map_entity_extension.dart',
        'domain/providers/task_tag_map/task_tag_map_usecase_providers.dart',
        'domain/repositories/task_tag_map_repository.dart',
        'domain/usecases/task_tag_map_usecases.dart',
      ],
      // Словарь, который нужно применить к этой группе файлов
      dictionaries: DictionaryPresets.M2M
    }
  ] as CustomFileGroup[], // <-- Явно указываем тип для строгости

  // Оставляем templated пустым, если он не нужен
  templated: []
};