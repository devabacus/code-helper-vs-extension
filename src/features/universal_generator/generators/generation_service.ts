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
import { allManifests } from './manifests';

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

        // Основой для сканирования всегда является манифест startProject.
        const scanDirs = allManifests.startProject.scan_dirs || [];

        for (const dir of scanDirs) {
            // 1. Для каждой директории из манифеста (`lib/`, `server/`) определяем ее базовый путь.
            const { sourceBasePath } = getPathInfo(config, dir);
            const fullDirSourcePath = path.join(sourceBasePath, dir);

            // Проверяем, существует ли такая директория, прежде чем сканировать.
            if (!await this.fileSystem.exists(fullDirSourcePath)) {
                continue;
            }

            // 2. Рекурсивно сканируем найденную директорию.
            const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);

            for (const fullFilePath of filesInDir) {
                // Пропускаем уже сгенерированные файлы.
                if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {
                    continue;
                }

                const content = await this.fileSystem.readFile(fullFilePath);
                
                // Передаем в анализатор путь, чтобы он мог использовать соглашения об именовании.
                const relativePath = path.relative(sourceBasePath, fullFilePath);
                const fileManifest = MarkerAnalyzer.analyze(content);

                // --- ЧИСТАЯ ЛОГИКА ПРОВЕРКИ ---
                // Шаг 1: Сначала проверяем, нужно ли принудительно пропустить файл.
                if (fileManifest.types.includes('ignore')) {
                    continue;
                }

                // Шаг 2: Теперь проверяем, относится ли файл к одной из активных фич.
                const isRelevant = config.features.some(feature => fileManifest.types.includes(feature as any));
                if (!isRelevant) {
                    continue;
                }
                // --- КОНЕЦ ЛОГИКИ ПРОВЕРКИ ---


                // --- Логика получения словарей (гибридный подход) ---
                let dictionaries: readonly DictionaryName[];
                if (fileManifest.dictionaries.length > 0) {
                    // 1. Приоритет: словари, указанные в файле.
                    dictionaries = fileManifest.dictionaries;
                } else {
                    // 2. По умолчанию: словари из соответствующего манифеста.
                    const manifestKey = config.features.find(f => fileManifest.types.includes(f as any));
                    const manifest = manifestKey ? allManifests[manifestKey] : null;
                    dictionaries = manifest?.dictionaries || [];
                }
                const rules = getDictionaryRules(dictionaries, config);
                // ----------------------------------------------------

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

        // 1. Применяем простые замены по правилам из словарей.
        for (const rule of rules) {
            content = content.replace(new RegExp(rule.from, 'g'), rule.to);
        }

        // 2. Применяем замену секций.
        content = this.sectionReplacer.process(content, config, model);

        // 3. Сохраняем итоговый файл.
        const { destinationBasePath } = getPathInfo(config, relativePath);
        const destinationRelativePath = this._getDestinationPath(relativePath, config);
        const destinationPath = path.join(destinationBasePath, destinationRelativePath);

        await this.fileSystem.createFolder(path.dirname(destinationPath));
        await this.fileSystem.createFile(destinationPath, content);
    }

    private _getDestinationPath(relativePath: string, config: GenerationConfig): string {
        let destinationRelativePath = relativePath;
        
        // Определяем, какие сущности использовать для замены в именах файлов.
        const templEntity = config.targetEntity1 && config.targetEntity2 ? 'task_tag' : config.templEntity;
        const targetEntity = config.targetEntity1 && config.targetEntity2 ? `${config.targetEntity1}_${config.targetEntity2}` : config.targetEntity;

        if (targetEntity && templEntity) {
            destinationRelativePath = destinationRelativePath.replaceAll(templEntity, targetEntity);
        }

        // Также заменяем имя проекта в путях, если это необходимо.
        destinationRelativePath = destinationRelativePath.replaceAll(config.templProject, config.targetProject);

        return destinationRelativePath;
    }
}