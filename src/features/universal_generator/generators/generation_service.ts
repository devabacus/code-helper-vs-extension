import path from 'path';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { allManifests } from '../manifests';
import { GenerationConfig } from '../generation_config';
import { getDictionaryRules } from '../replacement_util';
import { ReplaceTask, ReplacingFileProcessor } from './replacing_file_processor';
import { StaticCopyTask, StaticFileProcessor } from './static_file_processor';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { SectionConfig, SectionReplacer } from '../section_config';
import { getSectionGenerator } from './section_generators';


export class GenerationService {
  private readonly fileSystem: IFileSystem;
  private readonly staticProcessor: StaticFileProcessor;
  private readonly replacingProcessor: ReplacingFileProcessor;
  private readonly sectionReplacer: SectionReplacer; // <-- Добавляем реплейсер секций

  constructor(fileSystem?: IFileSystem) {
    this.fileSystem = fileSystem || new DefaultFileSystem();
    this.staticProcessor = new StaticFileProcessor(this.fileSystem);
    this.replacingProcessor = new ReplacingFileProcessor(this.fileSystem);
    this.sectionReplacer = new SectionReplacer(); // <-- Инициализируем
  }

  public async generate(config: GenerationConfig, model: ServerpodModel): Promise<void> {
    // 1. Собираем все задачи из выбранных фичей
    const allStaticTasks: StaticCopyTask[] = [];
    const allReplaceTasks: ReplaceTask[] = [];

    for (const featureName of config.features) {
      const manifest = allManifests[featureName];

      // Статические файлы
      for (const relativePath of manifest.static) {
        allStaticTasks.push({
          sourcePath: path.join(config.templFlutterProjectPath, relativePath),
          destinationPath: path.join(config.targetFlutterProjectPath, relativePath)
        });
      }

      // Файлы с заменой
      for (const replaceRule of manifest.replace) {
        const rules = getDictionaryRules(replaceRule.dictionaries, config);
        for (const filePath of replaceRule.files) {
          // Определяем пути для core или feature файлов
          const isCoreFile = filePath.includes('core');
          const sourceBasePath = isCoreFile ? config.templFlutterProjectPath : config.sourceFeaturePath;
          const destinationBasePath = isCoreFile ? config.targetFlutterProjectPath : config.targetFeaturePath;

          allReplaceTasks.push({
            sourcePath: path.join(sourceBasePath, filePath.replace('category', config.templEntity!)),
            destinationPath: path.join(destinationBasePath, filePath.replace('category', config.targetEntity!)),
            rules
          });
        }
      }

        if (manifest.templated) {
        for (const task of manifest.templated) {
            // Путь к файлу-шаблону в фиче
            const sourcePath = path.join(config.sourceFeaturePath, task.file);
            // Путь назначения в новой фиче
            const destinationPath = path.join(config.targetFeaturePath, task.file.replace('category', config.targetEntity!));

            // Читаем контент файла-шаблона
            let content = await this.fileSystem.readFile(sourcePath);

            // Этап A: Простая замена по словарям
            const simpleRules = getDictionaryRules(task.dictionaries, config);
            for (const rule of simpleRules) {
                content = content.replace(new RegExp(rule.from, 'g'), rule.to);
            }

            // Этап B: Замена по секциям
            const sectionConfigs: SectionConfig[] = [];
            for (const section of task.sections) {
                const generatorFunc = getSectionGenerator(section.generator);
                if (generatorFunc) {
                    sectionConfigs.push({
                        startMarker: section.startMarker,
                        endMarker: section.endMarker,
                        newContent: generatorFunc(config, model)
                    });
                }
            }
            content = this.sectionReplacer.process(content, sectionConfigs);

            // Этап C: Сохраняем итоговый файл
            await this.fileSystem.createFolder(path.dirname(destinationPath));
            await this.fileSystem.createFile(destinationPath, content);
        }
      }
    }

      await Promise.all([
        this.staticProcessor.process(allStaticTasks),
        this.replacingProcessor.process(allReplaceTasks)
      ]);
    }
  }
