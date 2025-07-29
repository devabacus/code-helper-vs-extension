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
            if (!manifest) {continue;}

            // 1. Обработка статических файлов
            if ('static' in manifest && manifest.static) {
                for (const filePath of manifest.static) {
                    const { sourceBasePath, destinationBasePath, relativePath } = getPathInfo(config, filePath);
                    allStaticTasks.push({
                        sourcePath: path.join(sourceBasePath, relativePath),
                        destinationPath: path.join(destinationBasePath, relativePath),
                    });
                }
            }

            // 2. Обработка файловых групп (defaultEntityFiles, manyToManyFiles и т.д.)
            const processableGroups: [string, FileGroup | undefined][] = [
                ['defaultEntityFiles', (manifest as any).defaultEntityFiles],
                ['manyToManyFiles', (manifest as any).manyToManyFiles],
            ];

           for (const [groupName, group] of processableGroups) {
                if (group && model) {
                    const { replaceTasks, templatedPromises } = await this._processFileGroup(group, config, model, groupName);
                    allReplaceTasks.push(...replaceTasks);
                    allTemplatedPromises.push(...templatedPromises);
                }
            }
            // 3. Обработка customFiles (для обратной совместимости)
            if ('customFiles' in manifest && (manifest as any).customFiles && model) {
                for (const group of (manifest as any).customFiles) {
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
     * ✅ Приватный метод для обработки любой файловой группы.
     */
   private async _processFileGroup(
        group: FileGroup,
        config: GenerationConfig,
        model: ServerpodModel,
        groupName: string // <-- Получаем имя группы
    ): Promise<{ replaceTasks: ReplaceTask[]; templatedPromises: Promise<void>[] }> {
        const replaceTasks: ReplaceTask[] = [];
        const templatedPromises: Promise<void>[] = [];
        const rules = getDictionaryRules(group.dictionaries as any, config);

        // --- 1. Сбор исключений ---
        const exclusionSet = new Set<string>();
        if (group.templated) { group.templated.forEach(task => exclusionSet.add(task.file)); }
        if (group.replace) { group.replace.forEach(filePath => exclusionSet.add(filePath)); }

        // ★★★ ИЗМЕНЕНИЕ 2: Выбираем ключевое слово для фильтрации ★★★
        let entityToFilterBy: string | undefined;

        if (groupName === 'manyToManyFiles') {
            entityToFilterBy = 'task_tag'; // Для M2M ищем 'task_tag'
        } else if (groupName === 'defaultEntityFiles') {
            entityToFilterBy = config.templEntity; // Для обычных сущностей используем стандартный `templEntity` ('category')
        }

        // --- 2. Обработка директорий из `replace_dirs` ---
      if (group.replace_dirs) {
            for (const dirPath of group.replace_dirs) {
                const { sourceBasePath } = getPathInfo(config, dirPath);
                const fullDirSourcePath = path.join(sourceBasePath, dirPath);

                if (!await this.fileSystem.exists(fullDirSourcePath)) { continue; }

                const filesInDir = await (this.fileSystem as any).readDirectoryRecursive(fullDirSourcePath);
                
                for (const fullFilePath of filesInDir) {
                    if (fullFilePath.includes('.g.') || fullFilePath.includes('.freezed.')) {
                        continue;
                    }

                    const relativeFilePath = path.relative(sourceBasePath, fullFilePath).replace(/\\/g, '/');
                    
                    if (!exclusionSet.has(relativeFilePath)) {
                        // ★★★ ИЗМЕНЕНИЕ 3: Используем выбранное слово для фильтрации ★★★
                        if (entityToFilterBy && !relativeFilePath.includes(entityToFilterBy)) {
                            continue; // Пропускаем, если имя файла не содержит нужное слово
                        }
                        
                        replaceTasks.push(this._createReplaceTask(config, relativeFilePath, rules));
                    }
                }
            }
        }
        
        
        // --- 3. Обработка явного `replace` (остается без изменений) ---
        if (group.replace) {
            for (const filePath of group.replace) {
                replaceTasks.push(this._createReplaceTask(config, filePath, rules));
            }
        }

        // --- 4. Обработка `templated` (остается без изменений) ---
        if (group.templated) {
            for (const task of group.templated) {
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