import { StaticFileProcessor, StaticCopyTask } from './static_file_processor';
import { ReplacingFileProcessor, ReplaceTask, ReplacementRule } from './replacing_file_processor';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { allManifests, FeatureName } from '../manifests';
import path from 'path';
import { toPascalCase } from '../../../utils/text_work/text_util';
import { getDictionaryRules } from '../replacement_util';

export interface GenerationServiceConfig {
  sourceProjectPath: string;
  targetProjectPath: string;
  projectName: string;
  entityName?: string;
  features: FeatureName[];
}

export class GenerationService {
  private readonly staticProcessor: StaticFileProcessor;
  private readonly replacingProcessor: ReplacingFileProcessor;

  constructor(fileSystem?: IFileSystem) {
    const fsInstance = fileSystem || new DefaultFileSystem();
    this.staticProcessor = new StaticFileProcessor(fsInstance);
    this.replacingProcessor = new ReplacingFileProcessor(fsInstance);
  }

  public async generate(config: GenerationServiceConfig): Promise<void> {
    console.log('🚀 Запуск генерации проекта...');

    // 1. Собираем все задачи из выбранных фичей
    const staticTasks: StaticCopyTask[] = [];
    const replaceTasks: ReplaceTask[] = [];

    for (const featureName of config.features) {
      const manifest = allManifests[featureName];

      // Статические файлы
      for (const relativePath of manifest.static) {
        staticTasks.push({
          sourcePath: path.join(config.sourceProjectPath, relativePath),
          destinationPath: path.join(config.targetProjectPath, relativePath)
        });
      }

      // Файлы с заменой
      for (const replaceRule of manifest.replace) {
        const rules = getDictionaryRules(replaceRule.dictionaries, config);
        for (const filePath of replaceRule.files) {
          replaceTasks.push({
            sourcePath: path.join(config.sourceProjectPath, filePath),
            destinationPath: path.join(config.targetProjectPath, filePath),
            rules
          });
        }
      }
    }

    // 2. Выполняем задачи
    console.log(`   Статических файлов: ${staticTasks.length}, с заменой: ${replaceTasks.length}`);

    await Promise.all([
      this.staticProcessor.process(staticTasks),
      this.replacingProcessor.process(replaceTasks)
    ]);

    console.log('🎉 Генерация завершена!');
  }

  
}