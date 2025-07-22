import path from 'path';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { allManifests } from '../manifests';
import { GenerationConfig } from '../project_config';
import { getDictionaryRules } from '../replacement_util';
import { ReplaceTask, ReplacingFileProcessor } from './replacing_file_processor';
import { StaticCopyTask, StaticFileProcessor } from './static_file_processor';


export class GenerationService {
  private readonly staticProcessor: StaticFileProcessor;
  private readonly replacingProcessor: ReplacingFileProcessor;

  constructor(fileSystem?: IFileSystem) {
    const fsInstance = fileSystem || new DefaultFileSystem();
    this.staticProcessor = new StaticFileProcessor(fsInstance);
    this.replacingProcessor = new ReplacingFileProcessor(fsInstance);
  }

  public async generate(config: GenerationConfig): Promise<void> {
    // 1. Собираем все задачи из выбранных фичей
    const staticTasks: StaticCopyTask[] = [];
    const replaceTasks: ReplaceTask[] = [];

    for (const featureName of config.features) {
      const manifest = allManifests[featureName];

      // Статические файлы
      for (const relativePath of manifest.static) {
        staticTasks.push({
          sourcePath: path.join(config.templFlutterProjectPath, relativePath),
          destinationPath: path.join(config.targetFlutterProjectPath, relativePath)
        });
      }

      // Файлы с заменой
      for (const replaceRule of manifest.replace) {
        const rules = getDictionaryRules(replaceRule.dictionaries, config);
        for (const filePath of replaceRule.files) {
          let sourceBasePath = config.templFlutterProjectPath;
          let destinationBasePath = config.targetFlutterProjectPath;

          if (!filePath.includes('core')) {
            sourceBasePath = config.sourceFeaturePath;
            destinationBasePath = config.targetFeaturePath;
            replaceTasks.push({
              sourcePath: path.join(sourceBasePath, filePath),
              destinationPath: path.join(destinationBasePath, filePath),
              rules
            });
          }
        }
      }

      await Promise.all([
        this.staticProcessor.process(staticTasks),
        this.replacingProcessor.process(replaceTasks)
      ]);
    }


  }}