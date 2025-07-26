import path from 'path';
import { DefaultFileSystem } from '../../../core/implementations/default_file_system';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { allManifests } from '../manifests';
import { GenerationConfig } from '../generation_config';
import { getDictionaryRules } from '../replacement_util';
import { ReplacementRule, ReplaceTask, ReplacingFileProcessor } from './replacing_file_processor';
import { StaticCopyTask, StaticFileProcessor } from './static_file_processor';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { SectionConfig, SectionReplacer } from '../section_config';
import { getSectionGenerator } from './section_generators';


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
            const manifest = allManifests[featureName];

            // 1. Обработка статических файлов (с проверкой)
            if ('static' in manifest && manifest.static) {
              
                for (const filePath of manifest.static) {
                  const isProjectLevelFile = filePath.startsWith('lib/');
                  const sourceBasePath = isProjectLevelFile ? config.templFlutterProjectPath : config.sourceFeaturePath;
                  const destinationBasePath = isProjectLevelFile ? config.targetFlutterProjectPath : config.targetFeaturePath;
                    allStaticTasks.push({
                        sourcePath: path.join(sourceBasePath, filePath),
                        destinationPath: path.join(destinationBasePath, filePath)
                    });
                }
                
            }

            // 2. Новая логика для обработки структурированных манифестов
            // Обработка `defaultEntityFiles` (с проверкой)
            if ('defaultEntityFiles' in manifest && manifest.defaultEntityFiles && model) {
                const group = manifest.defaultEntityFiles;
                const rules = getDictionaryRules(group.dictionaries, config);

                if (group.replace) {
                    for (const filePath of group.replace) {
                        allReplaceTasks.push(this.createReplaceTask(config, filePath, rules));
                    }
                }
                
                if (group.templated) {
                    for (const task of group.templated) {
                        allTemplatedPromises.push(this.processTemplatedFile(config, task, rules, model));
                    }
                }
            }
            
            // Обработка `customFiles` (с проверкой)
            if ('customFiles' in manifest && manifest.customFiles && model) {
                 for (const group of manifest.customFiles) {
                    const rules = getDictionaryRules(group.dictionaries, config);
                    if (group.files) {
                        for (const filePath of group.files) {
                            allReplaceTasks.push(this.createReplaceTask(config, filePath, rules));
                        }
                    }
                 }
            }
        }

        await Promise.all([
            this.staticProcessor.process(allStaticTasks),
            this.replacingProcessor.process(allReplaceTasks),
            ...allTemplatedPromises
        ]);
    }
    
    private createReplaceTask(config: GenerationConfig, filePath: string, rules: ReplacementRule[]): ReplaceTask {
        const isProjectLevelFile = filePath.startsWith('lib/');
                  const sourceBasePath = isProjectLevelFile ? config.templFlutterProjectPath : config.sourceFeaturePath;
                  const destinationBasePath = isProjectLevelFile ? config.targetFlutterProjectPath : config.targetFeaturePath;

        return {
            sourcePath: path.join(sourceBasePath, filePath),
            destinationPath: path.join(destinationBasePath, filePath.replaceAll('category', config.targetEntity!)),
            rules
        };
    }

    private async processTemplatedFile(config: GenerationConfig, task: any, rules: ReplacementRule[], model: ServerpodModel): Promise<void> {
        const sourcePath = path.join(config.sourceFeaturePath, task.file);
        const destinationPath = path.join(config.targetFeaturePath, task.file.replaceAll('category', config.targetEntity!));

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
                        newContent: generatorFunc(config, model)
                    });
                }
            }
            content = this.sectionReplacer.process(content, sectionConfigs);
        }

        await this.fileSystem.createFolder(path.dirname(destinationPath));
        await this.fileSystem.createFile(destinationPath, content);
    }
}