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
import { RelationAnalyzer } from '../serverpod_yaml_parser/relation-analyzer';
import { RelationPatcher } from './relation_patcher';

export class GenerationService {
    private readonly fileSystem: IFileSystem;
    private readonly replacingProcessor: ReplacingFileProcessor;
    private readonly sectionReplacer: SectionReplacer;
    private readonly relationPatcher: RelationPatcher;

    constructor(fileSystem?: IFileSystem) {
        this.fileSystem = fileSystem || new DefaultFileSystem();
        this.replacingProcessor = new ReplacingFileProcessor(this.fileSystem);
        this.sectionReplacer = new SectionReplacer();
        this.relationPatcher = new RelationPatcher(this.fileSystem);
    }

    public async generate(config: GenerationConfig, model?: ServerpodModel): Promise<void> {
        const baseGenerationConfig = new GenerationConfig({ ...config, templEntity: 'category' });
        
        const allReplaceTasks: ReplaceTask[] = [];
        const allTemplatedPromises: Promise<void>[] = [];

        const directoriesToScan = new Set<string>();
        for (const featureName of baseGenerationConfig.features) {
            const manifest = allManifests[featureName as FeatureName];
            if (manifest?.scan_dirs) {
                manifest.scan_dirs.forEach(dir => directoriesToScan.add(dir));
            }
        }

        const isEntityBasedGeneration = baseGenerationConfig.features.includes('entity') || baseGenerationConfig.features.includes('manyToMany');

        for (const dir of directoriesToScan) {
            // Получаем все части пути из getPathInfo
            const pathInfo = getPathInfo(baseGenerationConfig, dir);
            
            // Собираем полный путь для сканирования
            const fullDirSourcePath = path.join(pathInfo.sourceBasePath, pathInfo.relativePath);
            // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

            if (!await this.fileSystem.exists(fullDirSourcePath)) {
                continue;
            }

            const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);

            for (const fullFilePath of filesInDir) {
                if (isEntityBasedGeneration && !fullFilePath.includes(baseGenerationConfig.templEntity)) {
                    continue;
                }
                
                if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {
                    continue;
                }

                const content = await this.fileSystem.readFile(fullFilePath);
                const fileManifest = MarkerAnalyzer.analyze(content);
                if (fileManifest.types.includes('ignore')) {
                    continue;
                }
                
                const isRelevant = baseGenerationConfig.features.some(feature => fileManifest.types.includes(feature as any));
                if (!isRelevant) {
                    continue;
                }

                const dictionaries = fileManifest.dictionaries.length > 0 ? fileManifest.dictionaries : allManifests[baseGenerationConfig.features[0]]?.dictionaries || [];
                const rules = getDictionaryRules(dictionaries, baseGenerationConfig);

                // `path.relative` будет работать правильно, так как `pathInfo.sourceBasePath` - это по-прежнему корневая папка проекта
                const relativePath = path.relative(pathInfo.sourceBasePath, fullFilePath).replace(/\\/g, '/');
                
                if (fileManifest.isTemplated && model) {
                    allTemplatedPromises.push(this._processTemplatedFile(baseGenerationConfig, relativePath, rules, model, content));
                } else {
                    allReplaceTasks.push(this._createReplaceTask(baseGenerationConfig, relativePath, rules));
                }
            }
        }
        
        await Promise.all([
            this.replacingProcessor.process(allReplaceTasks),
            ...allTemplatedPromises,
        ]);

        if (model && RelationAnalyzer.manyToOneFields(model.fields).length > 0) {
            await this.relationPatcher.patch(config, model); 
        }
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
        let destinationRelativePath = relativePath.replaceAll(config.templEntity, config.targetEntity);
        destinationRelativePath = destinationRelativePath.replaceAll(config.templProject, config.targetProject);
        return destinationRelativePath;
    }
}