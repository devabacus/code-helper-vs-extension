import { Command } from "../../../core/interfaces/command";
import { toPascalCase } from "../../../utils/text_work/text_util";
import { GeneratorFactory } from "../factories/generator_factory";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../feature/data/datasources/local/tables/drift_table_parser"; // Добавлен импорт
import { RelationType, TableRelation } from "../interfaces/table_relation.interface";


export class GenerateAllFilesCommand implements Command {

    private isRelationTable: boolean;
    private relations: TableRelation[];
    private classParser: DriftClassParser;
    private tableParser: DriftTableParser; // <--- Добавлено поле tableParser
    private serverpodProtocolModelDir?: string; // Опциональный параметр для Serverpod
    private serverProjectEndpointsDir?: string; // Новое поле


    constructor(
        private generatorFactory: GeneratorFactory,
        private featurePath: string,
        private driftClassName: string,
        commandData: {
            classParser: DriftClassParser;
            tableParser: DriftTableParser;
            isRelationTable: boolean;
            relations: TableRelation[];
        },
        serverpodProtocolModelDir?: string,
        serverProjectEndpointsDir?: string // Новый параметр
    ) {
        this.classParser = commandData.classParser;
        this.tableParser = commandData.tableParser;
        this.isRelationTable = commandData.isRelationTable;
        this.relations = commandData.relations;
        this.serverpodProtocolModelDir = serverpodProtocolModelDir;
        this.serverProjectEndpointsDir = serverProjectEndpointsDir; // Присваиваем новое поле
    }


    async execute(): Promise<void> {
        const entityNameForGenerators = this.driftClassName; // Используем camelCase имя для большинства генераторов

        if (!this.isRelationTable) {
            console.log(`Обычная таблица: ${entityNameForGenerators}. Запуск стандартной генерации файлов.`);
            // data layer
            await this.generatorFactory.createDataRepositoryGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createModelGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDaoGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createLocalSourcesGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDataProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);

            //extensions
            await this.generatorFactory.createDataTableExtensionGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDataModelExtensionGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);

            // domain layer
            await this.generatorFactory.createEntityGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDomainRepositoryGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDomainProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDomainEntityExtensionGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createLocalDataSourceServiceGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);

            // domain layer use_cases
            await this.generatorFactory.createUseCaseCreateGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseUpdateGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseDeleteGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseGetByIdGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseGetAllGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseWatchAllGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);

            //presentation layer
            await this.generatorFactory.createPresentStateProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createPresentGetByIdProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            if (this.serverProjectEndpointsDir) {
                const serverpodEntityNamePascal = this.classParser.driftClassNameUpper; // Используем PascalCase

                console.log(`Генерация Serverpod Endpoint для ${serverpodEntityNamePascal}.`);
                await this.generatorFactory.createServerpodEndpointGenerator().generate(
                    this.serverProjectEndpointsDir, // Это директория для эндпоинтов, например, <server_proj>/lib/src/endpoints
                    serverpodEntityNamePascal,    // Передаем имя в PascalCase
                    { classParser: this.classParser, tableParser: this.tableParser }
                );
            }



        } else {
            const manyToManyRelation = this.relations.find(r => r.relationType === RelationType.MANY_TO_MANY);
            if (manyToManyRelation && manyToManyRelation.intermediateTable === this.classParser.driftClassNameUpper) {
                console.log(`Обнаружена связующая таблица: ${entityNameForGenerators}. Связывает ${manyToManyRelation.sourceTable} и ${manyToManyRelation.targetTable}.`);
                
                await this.generatorFactory.createDaoRelateGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createDataLocalRelateDataSourceServiceGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createDataLocalRelateSourceGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createDomainRelateRepositoryGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createDataRepositoryRelateImplGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createDataProviderRelateGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createUseCaseRelateAddGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createUseCaseRelateGetTargetsForSourceGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createUseCaseRelateGetSourcesWithTargetGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createUseCaseRelateRemoveAllTargetsFromSourceGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createUseCaseRelateRemoveTargetFromSourceGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createUseCaseRelateProvidersGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createPresentStateRelateProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
                await this.generatorFactory.createPresentFilterRelateProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);

                // Генерация Serverpod эндпоинта для связующей таблицы
                if (this.serverProjectEndpointsDir) {
                    const intermediateTableNamePascal = this.classParser.driftClassNameUpper; // e.g., TaskTagMap
                    console.log(`Генерация Serverpod Relate Endpoint для ${intermediateTableNamePascal}.`);
                    await this.generatorFactory.createServerpodRelateEndpointGenerator().generate(
                        this.serverProjectEndpointsDir,    // Путь к эндпоинтам сервера
                        intermediateTableNamePascal,      // Имя промежуточной таблицы в PascalCase
                        this.classParser                  // Передаем DriftClassParser
                    );
                }


            } else {
                 console.warn(`Таблица ${entityNameForGenerators} определена как связующая (isRelationTable=true), но не является промежуточной таблицей для MANY_TO_MANY или детали связи не найдены.`);
                 if (this.serverpodProtocolModelDir) {
                 const serverpodEntityName = this.classParser.driftClassNameLower;
                 console.log(`Генерация Serverpod YAML для связующей таблицы ${this.classParser.driftClassNameUpper}.`);
                 await this.generatorFactory.createServerpodYamlGenerator().generate(
                     this.serverpodProtocolModelDir,
                     serverpodEntityName,
                     { classParser: this.classParser, tableParser: this.tableParser }
                 );
            }
            }
        }

        // Генерация Serverpod YAML файла, если serverpodProtocolModelDir предоставлен
        if (this.serverpodProtocolModelDir) {
            // entityName для Serverpod YAML файла - это имя класса Drift (PascalCase),
            // которое ServerpodYamlGenerator преобразует в snake_case для имени файла.
            // А для содержимого YAML (class: Name) используется PascalCase.
            const serverpodEntityName = this.classParser.driftClassNameLower; // Используем camelCase, ServerpodYamlGenerator сделает toSnakeCase для имени файла

            console.log(`Генерация Serverpod YAML для ${this.classParser.driftClassNameUpper}.`);
            await this.generatorFactory.createServerpodYamlGenerator().generate(
                this.serverpodProtocolModelDir,
                serverpodEntityName, // camelCase имя, которое getPath преобразует в snake_case для имени файла
                { classParser: this.classParser, tableParser: this.tableParser }
            );
        }
    }
}