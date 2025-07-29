// universal_generator/marker_analyzer.ts

import { DictionaryName } from "../replacement_util";


// Определяем возможные типы манифестов, которые могут быть указаны в файлах.
export type ManifestType = 'ignore' | 'startProject' | 'entity' | 'manyToMany' | 'serverpod' | 'deploy';

// Определяем структуру, описывающую "манифест" одного файла.
export interface FileManifest {
  types: ManifestType[];
  dictionaries: DictionaryName[];
  isTemplated: boolean;
}

/**
 * Анализирует содержимое файла на наличие специальных маркеров
 * и извлекает из них конфигурацию для генератора.
 */
export class MarkerAnalyzer {
  public static analyze(content: string): FileManifest {
    // Ищем строку с типами манифеста, например: // manifest: entity, start_project
    // const manifestLine = content.match(/\/\/\s*manifest:\s*([a-z_,\s]+)/);
    const manifestLine = content.match(/\/\/\s*manifest:\s*([^\r\n]+)/);
    let types: ManifestType[] = [];

    if (manifestLine && manifestLine[1]) {
      types = manifestLine[1].split(',').map(t => t.trim()).filter(Boolean) as ManifestType[];
    }

    // Ищем строку со словарями, например: // dictionaries: ENTITY, COMMON
    const dictionariesLine = content.match(/\/\/\s*dictionaries:\s*([A-Z_,\s]+)/i);
    let dictionaries: DictionaryName[] = [];
    
    if (dictionariesLine && dictionariesLine[1]) {
        dictionaries = dictionariesLine[1].split(',').map(d => d.trim().toLowerCase()).filter(Boolean) as DictionaryName[];
    }

    if (types.length === 0) {
    // Если маркеров нет, считаем файл частью проекта по умолчанию
        types.push('startProject'); 
    }
    
    // Проверяем, является ли файл шаблонным (содержит генерируемые секции).
    const isTemplated = /\/\/\s*===\s*generated_start:/.test(content);

    return { types, dictionaries, isTemplated };
  }
}