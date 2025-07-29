// universal_generator/section_config.ts

import { GenerationConfig } from "./paths/generation_config";
import { getSectionGenerator } from "./generators/section_generators";
import { ServerpodModel } from "./serverpod_yaml_parser/formatters/types";

/**
 * Класс для обработки файлов с генерируемыми секциями.
 * Он находит все блоки вида 'generated_start:NAME' и 'generated_end:NAME',
 * вызывает соответствующий генератор 'NAME' и вставляет результат.
 */
export class SectionReplacer {
  public process(
    content: string,
    config: GenerationConfig,
    model: ServerpodModel
  ): string {
    // Регулярное выражение для поиска всех блоков start/end с именем генератора.
    // \1 - это обратная ссылка, гарантирующая, что имя в start и end совпадает.
    const sectionRegex = /\/\/ === generated_start:(\w+) ===[\s\S]*?\/\/ === generated_end:\1 ===/g;
    
    return content.replace(sectionRegex, (match, generatorName) => {
      const generatorFunc = getSectionGenerator(generatorName);
      
      if (generatorFunc) {
        const newContent = generatorFunc(config, model) || ''; // Убедимся, что контент не null/undefined
        const startMarker = `// === generated_start:${generatorName} ===`;
        const endMarker = `// === generated_end:${generatorName} ===`;
        
        // Формируем новый блок с отступами для красоты.
        const indentedContent = newContent.split('\n').map(line => `  ${line}`).join('\n');
        return `${startMarker}\n${indentedContent}\n  ${endMarker}`;
      }
      
      // Если генератор для данного имени не найден, возвращаем исходный блок,
      // чтобы не сломать файл и дать понять, что что-то пошло не так.
      console.warn(`[SectionReplacer] Generator function not found for name: ${generatorName}`);
      return match;
    });
  }
}