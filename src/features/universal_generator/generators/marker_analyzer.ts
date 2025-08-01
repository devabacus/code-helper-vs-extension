// universal_generator/generators/marker_analyzer.ts

import { DictionaryName } from "../replacement_util";

// Определяем возможные типы манифестов.
export type ManifestType = 'ignore' | 'startProject' | 'entity' | 'manyToMany' | 'serverpod' | 'deploy';

// Определяем структуру, описывающую "манифест" одного файла.
export interface FileManifest {
  types: ManifestType[];
  dictionaries: DictionaryName[];
  isTemplated: boolean;
}

export class MarkerAnalyzer {
  public static analyze(content: string): FileManifest {
    const manifestLine = content.match(/(?:\/\/|#)\s*manifest:\s*([^\r\n]+)/);
    let types: ManifestType[] = [];

    if (manifestLine && manifestLine[1]) {
      types = manifestLine[1].split(',').map(t => t.trim() as ManifestType).filter(Boolean);
    }

    // Если в файле нет валидного маркера, он будет проигнорирован.
    if (types.length === 0) {
      types.push('ignore');
    }

    // Ищем строку со словарями.
    const dictionariesLine = content.match(/(?:\/\/|#)\s*dictionaries:\s*([A-Z_,\s]+)/i);

    let dictionaries: DictionaryName[] = [];
    
    if (dictionariesLine && dictionariesLine[1]) {
        dictionaries = dictionariesLine[1].split(',').map(d => d.trim().toLowerCase() as DictionaryName).filter(Boolean);
    }

    // Проверяем, является ли файл шаблонным.
    const isTemplated = /(?:\/\/|#)\s*===\s*generated_start:/.test(content);

    return { types, dictionaries, isTemplated };
  }
}