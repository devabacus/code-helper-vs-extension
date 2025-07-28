import path from 'path';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { allManifests } from '../manifests';
import { GenerationConfig } from '../paths/generation_config';
import { getPathInfo } from '../paths/path_handle';
import { getDictionaryRules } from '../replacement_util';
import { SectionConfig, SectionReplacer } from '../section_config';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { ReplacementRule, ReplaceTask, ReplacingFileProcessor } from './replacing_file_processor';
import { getSectionGenerator } from './section_generators';
import { StaticCopyTask, StaticFileProcessor } from './static_file_processor';


export class GenerationService {
  private readonly fileSystem: IFileSystem;
  private readonly staticProcessor: StaticFileProcessor;
  private readonly replacingProcessor: ReplacingFileProcessor;
  private readonly sectionReplacer: SectionReplacer;

  constructor(fileSystem?: IFileSystem) {
    this.fileSystem = fileSystem || new DefaultFileSystem();
    this.staticProcessor = new StaticFileProcessor(this.fileSystem);
    this.replacingProcessor = new ReplacingFileProcessor(this.fileSystem);
    this.sectionReplacer = new SectionReplacer();
  }

  public async generate(config: GenerationConfig, model?: ServerpodModel): Promise<void> {
    const allStaticTasks: StaticCopyTask[] = [];
    const allReplaceTasks: ReplaceTask[] = [];
    const allTemplatedPromises: Promise<void>[] = [];

    for (const featureName of config.features) {
      const manifest = allManifests[featureName];

      // 1. Обработка статических файлов (с новой логикой путей)
      if ('static' in manifest && manifest.static) {
        for (const filePath of manifest.static) {
          const { sourceBasePath, destinationBasePath, relativePath } = getPathInfo(config, filePath);
          allStaticTasks.push({
            sourcePath: path.join(sourceBasePath, relativePath),
            destinationPath: path.join(destinationBasePath, relativePath)
          });
        }
      }

      // 2. Обработка структурированных манифестов
      // Обработка `defaultEntityFiles`
      if ('defaultEntityFiles' in manifest && manifest.defaultEntityFiles && model) {
        const group = manifest.defaultEntityFiles;
        const rules = getDictionaryRules(group.dictionaries, config);

        if (group.replace) {
          for (const filePath of group.replace) {
            allReplaceTasks.push(this.createReplaceTask(config, filePath, rules));
          }
        }

        if (group.templated) {
          for (const task of group.templated) {
            allTemplatedPromises.push(this.processTemplatedFile(config, task, rules, model));
          }
        }
      }

      // Обработка `customFiles`
      if ('customFiles' in manifest && manifest.customFiles && model) {
        for (const group of manifest.customFiles) {
          const rules = getDictionaryRules(group.dictionaries, config);
          if (group.files) {
            for (const filePath of group.files) {
              allReplaceTasks.push(this.createReplaceTask(config, filePath, rules));
            }
          }
        }
      }
    }

    await Promise.all([
      this.staticProcessor.process(allStaticTasks),
      this.replacingProcessor.process(allReplaceTasks),
      ...allTemplatedPromises
    ]);
  }

  /**
   * Создает задачу на замену контента в файле.
   */
  private createReplaceTask(config: GenerationConfig, filePath: string, rules: ReplacementRule[]): ReplaceTask {
    const { sourceBasePath, destinationBasePath, relativePath } = getPathInfo(config, filePath);

    let destinationRelativePath = relativePath;

    if (config.targetEntity1 && config.targetEntity2) {
      destinationRelativePath = destinationRelativePath
        .replaceAll('task_tag', `${config.targetEntity1}_${config.targetEntity2}`)
    } else if (config.targetEntity) {
      destinationRelativePath = destinationRelativePath.replaceAll(config.templEntity, config.targetEntity);
    }
    
    return {
      sourcePath: path.join(sourceBasePath, relativePath),
      // ИЗМЕНЕНИЕ ЗДЕСЬ: Используем правильный destinationRelativePath
      destinationPath: path.join(destinationBasePath, destinationRelativePath),
      rules
    };
  }

  /**
   * Обрабатывает один шаблонный файл: выполняет замену по словарю и по секциям.
   */
  private async processTemplatedFile(config: GenerationConfig, task: any, rules: ReplacementRule[], model: ServerpodModel): Promise<void> {
    const { sourceBasePath, destinationBasePath, relativePath } = getPathInfo(config, task.file);

    const sourcePath = path.join(sourceBasePath, relativePath);
    let destinationRelativePath = relativePath;

    if (config.targetEntity1 && config.targetEntity2) {
      destinationRelativePath = destinationRelativePath
        .replaceAll('task_tag', `${config.targetEntity1}_${config.targetEntity2}`)
    } else if (config.targetEntity) {
      destinationRelativePath = destinationRelativePath.replaceAll(config.templEntity, config.targetEntity);
    }

    // ИЗМЕНЕНИЕ ЗДЕСЬ: Используем правильный destinationRelativePath
    const destinationPath = path.join(destinationBasePath, destinationRelativePath);

    let content = await this.fileSystem.readFile(sourcePath);

    // 1. Простая замена по правилам из словаря
    for (const rule of rules) {
      content = content.replace(new RegExp(rule.from, 'g'), rule.to);
    }

    // 2. Замена по секциям с помощью генераторов
    if (task.generators) {
      const sectionConfigs: SectionConfig[] = [];
      for (const [index, generatorName] of task.generators.entries()) {
        const generatorFunc = getSectionGenerator(generatorName);
        if (generatorFunc) {
          sectionConfigs.push({
            startMarker: `// === GENERATED_START_${index} ===`,
            endMarker: `// === GENERATED_END_${index} ===`,
            newContent: generatorFunc(config, model)
          });
        }
      }
      content = this.sectionReplacer.process(content, sectionConfigs);
    }

    await this.fileSystem.createFolder(path.dirname(destinationPath));
    await this.fileSystem.createFile(destinationPath, content);
  }
}