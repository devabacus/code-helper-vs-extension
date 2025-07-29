import path from 'path';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { allManifests, FeatureName } from '../manifests';
import { GenerationConfig } from '../paths/generation_config';
import { getPathInfo } from '../paths/path_handle';
import { getDictionaryRules } from '../replacement_util';
import { SectionConfig, SectionReplacer } from '../section_config';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { ReplacementRule, ReplaceTask, ReplacingFileProcessor } from './replacing_file_processor';
import { getSectionGenerator } from './section_generators';
import { StaticCopyTask, StaticFileProcessor } from './static_file_processor';

// Интерфейс для файловых групп в манифестах для лучшей типизации
interface FileGroup {
    dictionaries: readonly string[];
    replace_dirs?: string[];
    replace?: string[];
    templated?: { file: string; generators: string[] }[];
}

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
            const manifest = allManifests[featureName as FeatureName];
            if (!manifest) { continue; }

            // --- ШАГ 1: Собираем единый и полный список исключений для этого манифеста ---
            const exclusionSet = new Set<string>();

            // 1.1 Файлы, которые нужно полностью проигнорировать
            if ('exclude' in manifest && (manifest as any).exclude) {
                (manifest as any).exclude.forEach((file: string) => exclusionSet.add(file));
            }

            // 1.2 Файлы, обрабатываемые по особым правилам (они не должны попадать в обработку директорий)
            const fileGroups = ['defaultEntityFiles', 'manyToManyFiles'];
            for (const groupName of fileGroups) {
                const group = (manifest as any)[groupName];
                if (!group) {continue;}
                if (group.templated) {
                    group.templated.forEach((task: { file: string; }) => exclusionSet.add(task.file));
                }
                if (group.replace) {
                    group.replace.forEach((filePath: string) => exclusionSet.add(filePath));
                }
            }
            if ('customFiles' in manifest && (manifest as any).customFiles) {
                (manifest as any).customFiles.forEach((group: { files: string[] }) => {
                    if (group.files) {group.files.forEach(file => exclusionSet.add(file));}
                });
            }
            if ('static' in manifest && manifest.static) {
                manifest.static.forEach(file => exclusionSet.add(file));
            }

            // --- ШАГ 2: Обрабатываем все секции, используя список исключений ---

            // 2.1 Обработка ОДИНОЧНЫХ статических файлов
            if ('static' in manifest && manifest.static) {
                for (const filePath of manifest.static) {
                    if ((manifest as any).exclude?.includes(filePath)) {continue;} // Проверка, что файл не в главном exclude
                    const { sourceBasePath, destinationBasePath, relativePath } = getPathInfo(config, filePath);
                    allStaticTasks.push({
                        sourcePath: path.join(sourceBasePath, relativePath),
                        destinationPath: path.join(destinationBasePath, relativePath),
                    });
                }
            }
            
           if ('static_dirs' in manifest && (manifest as any).static_dirs) {
    for (const dirPath of (manifest as any).static_dirs) {
        const { sourceBasePath, destinationBasePath } = getPathInfo(config, dirPath);
        const fullDirSourcePath = path.join(sourceBasePath, dirPath);

        if (!await this.fileSystem.exists(fullDirSourcePath)) { continue; }

        const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);

        for (const fullFilePath of filesInDir) {
            // ✅ ДОБАВЛЕНА ПРОВЕРКА: Игнорируем .g. и .freezed. файлы
            if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {
                continue;
            }

            const relativeFilePath = path.relative(sourceBasePath, fullFilePath).replace(/\\/g, '/');
            if (exclusionSet.has(relativeFilePath)) {
                continue; 
            }
            allStaticTasks.push({
                sourcePath: fullFilePath,
                destinationPath: path.join(destinationBasePath, relativeFilePath),
            });
        }
    }
}

            // 2.3 Обработка файловых групп (defaultEntityFiles, manyToManyFiles и т.д.)
            for (const [groupName, group] of fileGroups.map(name => [name, (manifest as any)[name]])) {
                if (group && model) {
                    const { replaceTasks, templatedPromises } = await this._processFileGroup(group, config, model, groupName as string, exclusionSet);
                    allReplaceTasks.push(...replaceTasks);
                    allTemplatedPromises.push(...templatedPromises);
                }
            }

            // 2.4 Обработка customFiles (для обратной совместимости)
            if ('customFiles' in manifest && (manifest as any).customFiles && model) {
                for (const group of (manifest as any).customFiles) {
                    if ((manifest as any).exclude?.some((ex: string) => group.files.includes(ex))) {continue;}
                    const rules = getDictionaryRules(group.dictionaries, config);
                    if (group.files) {
                        for (const filePath of group.files) {
                            allReplaceTasks.push(this._createReplaceTask(config, filePath, rules));
                        }
                    }
                }
            }
        }

        await Promise.all([
            this.staticProcessor.process(allStaticTasks),
            this.replacingProcessor.process(allReplaceTasks),
            ...allTemplatedPromises,
        ]);
    }

    /**
     * ✅ Приватный метод для обработки одной файловой группы (defaultEntityFiles, manyToManyFiles).
     */
    private async _processFileGroup(
        group: FileGroup,
        config: GenerationConfig,
        model: ServerpodModel,
        groupName: string,
        // Принимает уже готовый набор исключений
        exclusionSet: Set<string> 
    ): Promise<{ replaceTasks: ReplaceTask[]; templatedPromises: Promise<void>[] }> {
        const replaceTasks: ReplaceTask[] = [];
        const templatedPromises: Promise<void>[] = [];
        const rules = getDictionaryRules(group.dictionaries as any, config);

        // Определяем, по какому слову фильтровать файлы для этой группы
        let entityToFilterBy: string | undefined;
        if (groupName === 'manyToManyFiles') {
            entityToFilterBy = 'task_tag'; // Для M2M ищем 'task_tag'
        } else if (groupName === 'defaultEntityFiles') {
            entityToFilterBy = config.templEntity; // Для обычных сущностей 'category'
        }

        // --- Обработка директорий из `replace_dirs` ---
        if (group.replace_dirs) {
            for (const dirPath of group.replace_dirs) {
                const { sourceBasePath } = getPathInfo(config, dirPath);
                const fullDirSourcePath = path.join(sourceBasePath, dirPath);

                if (!await this.fileSystem.exists(fullDirSourcePath)) { continue; }

                const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);
                
                for (const fullFilePath of filesInDir) {
                    const relativeFilePath = path.relative(sourceBasePath, fullFilePath).replace(/\\/g, '/');

                    // Пропускаем файл, если он уже обрабатывается другим правилом или исключен
                    if (exclusionSet.has(relativeFilePath)) {
                        continue;
                    }
                    
                    // Пропускаем сгенерированные build_runner'ом файлы
                    if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {
                        continue;
                    }
                    
                    // Пропускаем, если имя файла не содержит нужную нам шаблонную сущность
                    if (entityToFilterBy && !relativeFilePath.includes(entityToFilterBy)) {
                        continue;
                    }
                    
                    replaceTasks.push(this._createReplaceTask(config, relativeFilePath, rules));
                }
            }
        }
        
        // --- Обработка явного `replace` ---
        if (group.replace) {
            for (const filePath of group.replace) {
                 if (exclusionSet.has(filePath) && !group.replace.includes(filePath)) {continue;}
                replaceTasks.push(this._createReplaceTask(config, filePath, rules));
            }
        }

        // --- Обработка `templated` ---
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

        // 1. Простая замена по правилам
        for (const rule of rules) {
            content = content.replace(new RegExp(rule.from, 'g'), rule.to);
        }

        // 2. Замена по секциям с генераторами
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