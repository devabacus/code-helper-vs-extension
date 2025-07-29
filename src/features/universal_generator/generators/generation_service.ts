import path from 'path';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { allManifests, FeatureName } from '../manifests';
import { GenerationConfig } from '../paths/generation_config';
import { getPathInfo } from '../paths/path_handle';
// ✅ Импортируем нужные типы
import { getDictionaryRules, DictionaryName } from '../replacement_util'; 
import { SectionConfig, SectionReplacer } from '../section_config';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { ReplacementRule, ReplaceTask, ReplacingFileProcessor } from './replacing_file_processor';
import { getSectionGenerator } from './section_generators';

// Интерфейсы для типизации манифестов
interface FileGroup {
    dictionaries: readonly DictionaryName[]; // <-- Используем правильный тип
    replace_dirs?: string[];
    replace?: string[];
    templated?: { file: string; generators: string[] }[];
}

interface BaseFileGroup {
    // ✅ ИСПРАВЛЕНИЕ: Используем конкретный тип DictionaryName вместо string
    dictionaries: readonly DictionaryName[]; 
    dirs?: string[];
    files?: string[];
}

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

        for (const featureName of config.features) {
            const manifest = allManifests[featureName as FeatureName];
            if (!manifest) { continue; }

            const exclusionSet = new Set<string>();
            if ('exclude' in manifest && (manifest as any).exclude) {
                (manifest as any).exclude.forEach((file: string) => exclusionSet.add(file));
            }
            const fileGroupsForExclusion = ['defaultEntityFiles', 'manyToManyFiles'];
            for (const groupName of fileGroupsForExclusion) {
                const group = (manifest as any)[groupName];
                if (group?.templated) {
                    group.templated.forEach((task: { file: string; }) => exclusionSet.add(task.file));
                }
            }

            const baseFilesGroup = (manifest as any).baseFiles as BaseFileGroup | undefined;
            if (baseFilesGroup) {
                // Теперь здесь не будет ошибки, так как типы совпадают
                const rules = getDictionaryRules(baseFilesGroup.dictionaries, config);

                if (baseFilesGroup.files) {
                    for (const filePath of baseFilesGroup.files) {
                        if (exclusionSet.has(filePath)) {continue;}
                        allReplaceTasks.push(this._createReplaceTask(config, filePath, rules));
                    }
                }

                if (baseFilesGroup.dirs) {
                    for (const dirPath of baseFilesGroup.dirs) {
                        const { sourceBasePath } = getPathInfo(config, dirPath);
                        const fullDirSourcePath = path.join(sourceBasePath, dirPath);
                        if (!await this.fileSystem.exists(fullDirSourcePath)) { continue; }

                        const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);

                        for (const fullFilePath of filesInDir) {
                            if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {
                                continue;
                            }
                            const relativeFilePath = path.relative(sourceBasePath, fullFilePath).replace(/\\/g, '/');
                            if (exclusionSet.has(relativeFilePath)) {
                                continue;
                            }
                            allReplaceTasks.push(this._createReplaceTask(config, relativeFilePath, rules));
                        }
                    }
                }
            }
            
            const processableGroups = ['defaultEntityFiles', 'manyToManyFiles'];
            for (const [groupName, group] of processableGroups.map(name => [name, (manifest as any)[name]])) {
                if (group && model) {
                    const { replaceTasks, templatedPromises } = await this._processFileGroup(group, config, model, groupName as string, exclusionSet);
                    allReplaceTasks.push(...replaceTasks);
                    allTemplatedPromises.push(...templatedPromises);
                }
            }
        }

        await Promise.all([
            this.replacingProcessor.process(allReplaceTasks),
            ...allTemplatedPromises,
        ]);
    }

    /**
     * ✅ Приватный метод для обработки сложных файловых групп (defaultEntityFiles, manyToManyFiles).
     */
    private async _processFileGroup(
        group: FileGroup,
        config: GenerationConfig,
        model: ServerpodModel,
        groupName: string,
        exclusionSet: Set<string> 
    ): Promise<{ replaceTasks: ReplaceTask[]; templatedPromises: Promise<void>[] }> {
        const replaceTasks: ReplaceTask[] = [];
        const templatedPromises: Promise<void>[] = [];
        const rules = getDictionaryRules(group.dictionaries, config); // Здесь тоже все корректно

        let entityToFilterBy: string | undefined;
        if (groupName === 'manyToManyFiles') {
            entityToFilterBy = 'task_tag';
        } else if (groupName === 'defaultEntityFiles') {
            entityToFilterBy = config.templEntity;
        }

        if (group.replace_dirs) {
            for (const dirPath of group.replace_dirs) {
                const { sourceBasePath } = getPathInfo(config, dirPath);
                const fullDirSourcePath = path.join(sourceBasePath, dirPath);
                if (!await this.fileSystem.exists(fullDirSourcePath)) { continue; }

                const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);
                
                for (const fullFilePath of filesInDir) {
                    const relativeFilePath = path.relative(sourceBasePath, fullFilePath).replace(/\\/g, '/');
                    if (exclusionSet.has(relativeFilePath)) {continue;}
                    if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {continue;}
                    if (entityToFilterBy && !relativeFilePath.includes(entityToFilterBy)) {continue;}
                    
                    replaceTasks.push(this._createReplaceTask(config, relativeFilePath, rules));
                }
            }
        }
        
        if (group.replace) {
            for (const filePath of group.replace) {
                if (exclusionSet.has(filePath)) {continue;}
                replaceTasks.push(this._createReplaceTask(config, filePath, rules));
            }
        }

        if (group.templated) {
            for (const task of group.templated) {
                if (exclusionSet.has(task.file) && !group.templated.some(t => t.file === task.file)) {continue;}
                templatedPromises.push(this._processTemplatedFile(config, task, rules, model));
            }
        }

        return { replaceTasks, templatedPromises };
    }

    /**
     * Создает задачу на замену контента в файле.
     */
    private _createReplaceTask(config: GenerationConfig, filePath: string, rules: ReplacementRule[]): ReplaceTask {
        const { sourceBasePath, destinationBasePath, relativePath } = getPathInfo(config, filePath);
        let destinationRelativePath = relativePath;

        const templEntity = config.targetEntity1 && config.targetEntity2 ? 'task_tag' : config.templEntity;
        const targetEntity = config.targetEntity1 && config.targetEntity2 ? `${config.targetEntity1}_${config.targetEntity2}` : config.targetEntity;
        
        if (targetEntity) {
            destinationRelativePath = destinationRelativePath.replaceAll(templEntity, targetEntity);
        }

        return {
            sourcePath: path.join(sourceBasePath, relativePath),
            destinationPath: path.join(destinationBasePath, destinationRelativePath),
            rules,
        };
    }

    /**
     * Обрабатывает один шаблонный файл: выполняет замену и вставляет секции.
     */
    private async _processTemplatedFile(config: GenerationConfig, task: { file: string, generators: string[] }, rules: ReplacementRule[], model: ServerpodModel): Promise<void> {
        const { sourceBasePath, destinationBasePath, relativePath } = getPathInfo(config, task.file);
        const sourcePath = path.join(sourceBasePath, relativePath);

        if (!await this.fileSystem.exists(sourcePath)) {
            console.warn(`[GenerationService] Templated file not found, skipping: ${sourcePath}`);
            return;
        }
        
        let content = await this.fileSystem.readFile(sourcePath);

        for (const rule of rules) {
            content = content.replace(new RegExp(rule.from, 'g'), rule.to);
        }

        if (task.generators) {
            const sectionConfigs: SectionConfig[] = [];
            for (const [index, generatorName] of task.generators.entries()) {
                const generatorFunc = getSectionGenerator(generatorName);
                if (generatorFunc) {
                    sectionConfigs.push({
                        startMarker: `// === GENERATED_START_${index} ===`,
                        endMarker: `// === GENERATED_END_${index} ===`,
                        newContent: generatorFunc(config, model),
                    });
                }
            }
            content = this.sectionReplacer.process(content, sectionConfigs);
        }

        let destinationRelativePath = relativePath;
        const templEntity = config.targetEntity1 && config.targetEntity2 ? 'task_tag' : config.templEntity;
        const targetEntity = config.targetEntity1 && config.targetEntity2 ? `${config.targetEntity1}_${config.targetEntity2}` : config.targetEntity;
        
        if (targetEntity) {
            destinationRelativePath = destinationRelativePath.replaceAll(templEntity, targetEntity);
        }

        const destinationPath = path.join(destinationBasePath, destinationRelativePath);
        await this.fileSystem.createFolder(path.dirname(destinationPath));
        await this.fileSystem.createFile(destinationPath, content);
    }
}