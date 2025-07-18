import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { z } from 'zod';
import { StaticFileProcessor } from './static_file_processor';
import { ReplacingFileProcessor } from './replacing_file_processor';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import path from 'path';

// --- Схемы валидации для YAML с помощью Zod ---

// Схема для одного правила в манифесте
const manifestRuleSchema = z.object({
  processor: z.enum(['static', 'replace', 'sections']), // 'sections' - задел на будущее
  paths: z.array(z.string()),
  dictionaries: z.array(z.enum(['common', 'entity'])).optional(),
  group: z.string().optional(), // Для логирования
});

// Схема для всего массива правил (содержимого одного .yml файла)
const manifestSchema = z.array(manifestRuleSchema);

// Тип, выведенный из схемы Zod, для работы в коде
type Manifest = z.infer<typeof manifestSchema>;
type DictionaryKey = 'common' | 'entity';

// --- Конфигурация для генератора ---

export interface GeneratorConfig {
  sourceProjectPath: string;1
  targetProjectPath: string;
  projectName: string;
  entityName?: string; // Сущность может быть опциональной
}


// --- Основной сервис-оркестратор ---

export class GenerationService {
  private readonly staticProcessor: StaticFileProcessor;
  private readonly replacingProcessor: ReplacingFileProcessor;

  /**
   * Создает экземпляр сервиса генерации.
   * @param fileSystem - Реализация файловой системы. Позволяет подменять в тестах.
   */
  constructor(fileSystem?: IFileSystem) {
    const fsInstance = fileSystem || new DefaultFileSystem();
    this.staticProcessor = new StaticFileProcessor(fsInstance);
    this.replacingProcessor = new ReplacingFileProcessor(fsInstance);
  }

  /**
   * Главный метод, запускающий генерацию проекта на основе конфигурации.
   * @param config - Конфигурация для текущей сессии генерации.
   */
  public async generate(config: GeneratorConfig): Promise<void> {
    console.log('🚀 Запуск генерации проекта...');
    console.log(`   Исходный шаблон: ${config.sourceProjectPath}`);
    console.log(`   Целевой проект: ${config.targetProjectPath}`);

    // 1. Загружаем и объединяем все YAML манифесты из папки manifests
    const manifest = this.loadAndValidateManifests(path.join(config.sourceProjectPath, 'manifests'));
    console.log(`   Загружено ${manifest.length} правил из манифестов.`);

    // 2. Готовим "фабрику" словарей замен
    const dictionaryFactory = {
      common: this.createCommonDictionary(config.projectName),
      entity: config.entityName ? this.createEntityDictionary(config.entityName) : [],
    };

    // 3. Распределяем все файловые операции по соответствующим задачам
    const staticTasks: StaticCopyTask[] = [];
    const replaceTasks: ReplaceTask[] = [];

    for (const rule of manifest) {
      for (const relativePath of rule.paths) {
        const sourcePath = path.join(config.sourceProjectPath, relativePath);
        const destinationPath = path.join(config.targetProjectPath, relativePath);

        if (rule.processor === 'static') {
          staticTasks.push({ sourcePath, destinationPath });
        } else if (rule.processor === 'replace') {
          // Собираем итоговый словарь для этого правила
          const finalRules = rule.dictionaries?.flatMap(key => dictionaryFactory[key]) || [];
          replaceTasks.push({ sourcePath, destinationPath, rules: finalRules });
        }
        // Здесь можно будет добавить `else if (rule.processor === 'sections')` в будущем
      }
    }

    // 4. Асинхронно и параллельно запускаем выполнение всех собранных задач
    console.log(`   Подготовлено к обработке: ${staticTasks.length} статических файлов и ${replaceTasks.length} файлов с заменой.`);

    await Promise.all([
      this.staticProcessor.process(staticTasks),
      this.replacingProcessor.process(replaceTasks)
    ]);

    console.log('🎉 Генерация проекта успешно завершена!');
  }

  /**
   * Загружает, парсит, объединяет и валидирует все .yml файлы из указанной директории.
   * @param manifestDir - Путь к папке с .yml манифестами.
   * @returns Объединенный и валидированный массив правил.
   */
  private loadAndValidateManifests(manifestDir: string): Manifest {
    const manifestFiles = fs.readdirSync(manifestDir)
      .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));

    if (manifestFiles.length === 0) {
      console.warn(`Внимание: в директории ${manifestDir} не найдено .yml файлов.`);
      return [];
    }

    const allRules = manifestFiles.flatMap(file => {
      const filePath = path.join(manifestDir, file);
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      // Парсим YAML, разрешая пустые файлы
      return (yaml.load(yamlContent) as any[]) || [];
    });

    try {
      // Валидируем весь объединенный массив правил
      return manifestSchema.parse(allRules);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Ошибка валидации манифеста:', error.errors);
      }
      throw new Error('Обнаружена ошибка в структуре YAML-манифестов. Проверьте файлы конфигурации.');
    }
  }

  /**
   * Создает словарь для общих замен.
   */
  private createCommonDictionary(projectName: string): ReplacementRule[] {
    // В реальном проекте здесь может быть больше правил
    return [{ from: 'template_project_name', to: projectName }];
  }

  /**
   * Создает словарь для замен, связанных с сущностью.
   */
  private createEntityDictionary(entityName: string): ReplacementRule[] {
    return [
      { from: 'template_entity', to: entityName.toLowerCase() },
      { from: 'TemplateEntity', to: this.toPascalCase(entityName) },
      { from: 'templateEntity', to: this.toCamelCase(entityName) },
    ];
  }

  // --- Вспомогательные утилиты для работы со строками ---

  private toPascalCase(str: string): string {
    return str.replace(/(^\w|-\w)/g, text => text.replace(/-/, "").toUpperCase());
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }
}