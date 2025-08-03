// universal_generator/generators/generation_service.ts

import path from 'path';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { GenerationConfig } from '../paths/generation_config';
import { getDictionaryRules, DictionaryName } from '../replacement_util';
import { ReplacingFileProcessor, ReplaceTask, ReplacementRule } from './replacing_file_processor';
import { SectionReplacer } from '../section_config';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { getPathInfo } from '../paths/path_handle'; // Используем обновленный path_handle
import { MarkerAnalyzer } from './marker_analyzer';
import { allManifests, FeatureName } from './manifests';
import { RelationAnalyzer } from '../serverpod_yaml_parser/relation-analyzer';
import { RelationPatcher } from './relation_patcher';
import { scanWithIgnore } from '../../../utils/dir_handle_adv';

// Определим тип для PathInfo для большей строгости
interface PathInfo {
    sourceBasePath: string;
    destinationBasePath: string;
}

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

        const allReplaceTasks: ReplaceTask[] = [];
        const allTemplatedPromises: Promise<void>[] = [];

        const directoriesToScan = new Set<string>();
        for (const featureName of config.manifestFeatures) {
            const manifest = allManifests[featureName as FeatureName];
            if (manifest?.scan_dirs) {
                manifest.scan_dirs.forEach(dir => directoriesToScan.add(dir));
            }
        }

        const isEntityBasedGeneration = config.manifestFeatures.includes('entity') || config.manifestFeatures.includes('manyToMany');

        for (const dir of directoriesToScan) { // dir - это "flutter/", "server/" и т.д.

            // 1. Получаем правильные базовые пути для текущего типа директории
            const pathInfo = getPathInfo(config, dir);

            const fullDirSourcePath = pathInfo.sourceBasePath;

            if (!await this.fileSystem.exists(fullDirSourcePath)) {
                continue;
            }

            const filesInDir = await scanWithIgnore(fullDirSourcePath, this.fileSystem);

            for (const fullFilePath of filesInDir) {
                if (isEntityBasedGeneration && !fullFilePath.includes(config.templEntity)) {
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

                const isRelevant = config.manifestFeatures.some(feature => fileManifest.types.includes(feature as any));
                if (!isRelevant) {
                    continue;
                }

                const dictionaries = fileManifest.dictionaries.length > 0 ? fileManifest.dictionaries : allManifests[config.manifestFeatures[0]]?.dictionaries || [];
                const rules = getDictionaryRules(dictionaries, config);

                const relativePath = path.relative(fullDirSourcePath, fullFilePath).replace(/\\/g, '/');

                if (fileManifest.isTemplated && model) {
                    allTemplatedPromises.push(this._processTemplatedFile(config, relativePath, rules, model, content, pathInfo));
                } else {
                    allReplaceTasks.push(this._createReplaceTask(config, relativePath, rules, pathInfo));
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

    // 4. Обновляем сигнатуры методов, чтобы они принимали pathInfo
    private _createReplaceTask(config: GenerationConfig, relativePath: string, rules: ReplacementRule[], pathInfo: PathInfo): ReplaceTask {
        const destinationRelativePath = this._getDestinationPath(relativePath, config);
        return {
            sourcePath: path.join(pathInfo.sourceBasePath, relativePath),
            destinationPath: path.join(pathInfo.destinationBasePath, destinationRelativePath),
            rules,
        };
    }

    private async _processTemplatedFile(config: GenerationConfig, relativePath: string, rules: ReplacementRule[], model: ServerpodModel, initialContent: string, pathInfo: PathInfo): Promise<void> {
        let content = initialContent;
        for (const rule of rules) {
            content = content.replace(new RegExp(rule.from, 'g'), rule.to);
        }
        content = this.sectionReplacer.process(content, config, model);
        const destinationRelativePath = this._getDestinationPath(relativePath, config);
        const destinationPath = path.join(pathInfo.destinationBasePath, destinationRelativePath);
        await this.fileSystem.createFolder(path.dirname(destinationPath));
        await this.fileSystem.createFile(destinationPath, content);
    }

    private _getDestinationPath(relativePath: string, config: GenerationConfig): string {
        let destinationRelativePath = relativePath.replaceAll(config.templEntity, config.targetEntity);
        destinationRelativePath = destinationRelativePath.replaceAll(config.templProject, config.targetProject);
        return destinationRelativePath;
    }
}