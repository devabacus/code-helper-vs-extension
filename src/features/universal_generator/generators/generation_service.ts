// universal_generator/generators/generation_service.ts

import path from 'path';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { GenerationConfig } from '../paths/generation_config';
import { getDictionaryRules, DictionaryName } from '../replacement_util';
import { allManifests, FeatureName } from './manifests';
import { ReplacingFileProcessor, ReplaceTask, ReplacementRule } from './replacing_file_processor';
import { SectionReplacer } from '../section_config';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { getPathInfo } from '../paths/path_handle';
import { MarkerAnalyzer } from './marker_analyzer';

export class GenerationService {
  private readonly fileSystem: IFileSystem;
  private readonly replacingProcessor: ReplacingFileProcessor;
  private readonly sectionReplacer: SectionReplacer;

  constructor(fileSystem?: IFileSystem) {
    this.fileSystem = fileSystem || new DefaultFileSystem();
    this.replacingProcessor = new ReplacingFileProcessor(this.fileSystem);
    this.sectionReplacer = new SectionReplacer();
  }

  public async generate(config: GenerationConfig, model?: ServerpodModel): Promise<void> {
    const allReplaceTasks: ReplaceTask[] = [];
    const allTemplatedPromises: Promise<void>[] = [];

    const scanDirs = allManifests.startProject.scan_dirs || [];

    const sourceBasePath = config.templFlutterProjectPath;

    for (const dir of scanDirs) {
      const fullDirSourcePath = path.join(sourceBasePath, dir);
      if (!await this.fileSystem.exists(fullDirSourcePath)) { continue; }

      const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);

      for (const fullFilePath of filesInDir) {
        if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {
          continue;
        }

        const content = await this.fileSystem.readFile(fullFilePath);
        const fileManifest = MarkerAnalyzer.analyze(content);

        const relevantFeature = config.features.find(feature => fileManifest.types.includes(feature as any));

        if (!relevantFeature || fileManifest.types.includes('ignore')) {
          continue;
        }

        let dictionaries: readonly DictionaryName[];
        if (fileManifest.dictionaries.length > 0) {
          dictionaries = fileManifest.dictionaries;
        } else {
          const manifest = allManifests[relevantFeature];
          dictionaries = manifest.dictionaries;
        }
        const rules = getDictionaryRules(dictionaries, config);

        const relativeFilePath = path.relative(sourceBasePath, fullFilePath).replace(/\\/g, '/');

        if (fileManifest.isTemplated && model) {
          allTemplatedPromises.push(this._processTemplatedFile(config, relativeFilePath, rules, model, content));
        } else {
          allReplaceTasks.push(this._createReplaceTask(config, relativeFilePath, rules));
        }
      }
    }

    await Promise.all([
      this.replacingProcessor.process(allReplaceTasks),
      ...allTemplatedPromises,
    ]);
  }

  private _createReplaceTask(config: GenerationConfig, filePath: string, rules: ReplacementRule[]): ReplaceTask {
    const { sourceBasePath, destinationBasePath } = getPathInfo(config, filePath);
    const destinationRelativePath = this._getDestinationPath(filePath, config);

    return {
      sourcePath: path.join(sourceBasePath, filePath),
      destinationPath: path.join(destinationBasePath, destinationRelativePath),
      rules,
    };
  }

  private async _processTemplatedFile(config: GenerationConfig, filePath: string, rules: ReplacementRule[], model: ServerpodModel, initialContent: string): Promise<void> {
    let content = initialContent;

    for (const rule of rules) {
      content = content.replace(new RegExp(rule.from, 'g'), rule.to);
    }

    if (model) {
      content = this.sectionReplacer.process(content, config, model);
    }

    const destinationRelativePath = this._getDestinationPath(filePath, config);
    const { destinationBasePath } = getPathInfo(config, filePath);
    const destinationPath = path.join(destinationBasePath, destinationRelativePath);

    await this.fileSystem.createFolder(path.dirname(destinationPath));
    await this.fileSystem.createFile(destinationPath, content);
  }

  private _getDestinationPath(relativePath: string, config: GenerationConfig): string {
    let destinationRelativePath = relativePath;

    const templEntity = config.targetEntity1 && config.targetEntity2 ? 'task_tag' : config.templEntity;
    const targetEntity = config.targetEntity1 && config.targetEntity2 ? `${config.targetEntity1}_${config.targetEntity2}` : config.targetEntity;

    if (targetEntity && templEntity) {
      destinationRelativePath = destinationRelativePath.replaceAll(templEntity, targetEntity);
    }

    return destinationRelativePath;
  }
}