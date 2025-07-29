// universal_generator/generators/generation_service.ts

import path from 'path';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { GenerationConfig } from '../paths/generation_config';
import { getDictionaryRules, DictionaryName } from '../replacement_util';
import { ReplacingFileProcessor, ReplaceTask, ReplacementRule } from './replacing_file_processor';
import { SectionReplacer } from '../section_config';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { getPathInfo } from '../paths/path_handle';
import { MarkerAnalyzer } from './marker_analyzer';
import { allManifests, FeatureName } from './manifests';

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

        // 1. Собираем уникальный список директорий для сканирования
        // из ВСЕХ запрошенных в конфиге фич.
        const directoriesToScan = new Set<string>();
        for (const featureName of config.features) {
            const manifest = allManifests[featureName as FeatureName];
            if (manifest && 'scan_dirs' in manifest && Array.isArray(manifest.scan_dirs)) {
                manifest.scan_dirs.forEach(dir => directoriesToScan.add(dir));
            }
        }

        const scanDirs = Array.from(directoriesToScan);
        if (scanDirs.length === 0) {
            console.warn(`[GenerationService] Нет директорий для сканирования (scan_dirs) для фич: ${config.features.join(', ')}.`);
            return;
        }
        
        // 2. Сканируем каждую из собранных директорий.
        for (const dir of scanDirs) {
            const { sourceBasePath, relativePath } = getPathInfo(config, dir);
            const fullDirSourcePath = path.join(sourceBasePath, relativePath);

            if (!await this.fileSystem.exists(fullDirSourcePath)) {
                console.warn(`[GenerationService] Директория не найдена, пропускаем: ${fullDirSourcePath}`);
                continue;
            }

            const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);

            for (const fullFilePath of filesInDir) {
                if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {
                    continue;
                }

                const relativePath = path.relative(sourceBasePath, fullFilePath).replace(/\\/g, '/');

                const content = await this.fileSystem.readFile(fullFilePath);
                const fileManifest = MarkerAnalyzer.analyze(content); // Вызываем с одним параметром

                

                if (fileManifest.types.includes('ignore')) {
                    continue;
                }

                const isRelevant = config.features.some(feature => fileManifest.types.includes(feature as any));
                if (!isRelevant) {
                    continue;
                }

                let dictionaries: readonly DictionaryName[];
                if (fileManifest.dictionaries.length > 0) {
                    dictionaries = fileManifest.dictionaries;
                } else {
                    const manifestKey = config.features.find(f => fileManifest.types.includes(f as any));
                    const manifest = manifestKey ? allManifests[manifestKey] : null;
                    dictionaries = manifest?.dictionaries || [];
                }
                const rules = getDictionaryRules(dictionaries, config);

                // const relativePath = path.relative(sourceBasePath, fullFilePath);
                if (fileManifest.isTemplated && model) {
                    allTemplatedPromises.push(this._processTemplatedFile(config, relativePath, rules, model, content));
                } else {
                    allReplaceTasks.push(this._createReplaceTask(config, relativePath, rules));
                }
            }
        }

        await Promise.all([
            this.replacingProcessor.process(allReplaceTasks),
            ...allTemplatedPromises,
        ]);
    }

    private _createReplaceTask(config: GenerationConfig, relativePath: string, rules: ReplacementRule[]): ReplaceTask {
        const { sourceBasePath, destinationBasePath } = getPathInfo(config, relativePath);
        const destinationRelativePath = this._getDestinationPath(relativePath, config);

        return {
            sourcePath: path.join(sourceBasePath, relativePath),
            destinationPath: path.join(destinationBasePath, destinationRelativePath),
            rules,
        };
    }

    private async _processTemplatedFile(config: GenerationConfig, relativePath: string, rules: ReplacementRule[], model: ServerpodModel, initialContent: string): Promise<void> {
        let content = initialContent;
        for (const rule of rules) {
            content = content.replace(new RegExp(rule.from, 'g'), rule.to);
        }
        content = this.sectionReplacer.process(content, config, model);

        const { destinationBasePath } = getPathInfo(config, relativePath);
        const destinationRelativePath = this._getDestinationPath(relativePath, config);
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

        destinationRelativePath = destinationRelativePath.replaceAll(config.templProject, config.targetProject);

        return destinationRelativePath;
    }
}