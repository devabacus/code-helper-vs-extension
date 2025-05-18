import { Command } from "../../../core/interfaces/command";
import { toPascalCase } from "../../../utils/text_work/text_util";
import { GeneratorFactory } from "../factories/generator_factory";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";
import { RelationType, TableRelation } from "../interfaces/table_relation.interface";


export class GenerateAllFilesCommand implements Command {

    private isRelationTable: boolean;
    private relations: TableRelation[];
    private classParser: DriftClassParser;

    constructor(private generatorFactory: GeneratorFactory, private featurePath: string, private driftClassName: string, commandData: {
            classParser: DriftClassParser;
            isRelationTable: boolean;
            relations: TableRelation[];
        }) {
            this.classParser = commandData.classParser; 
            this.isRelationTable = commandData.isRelationTable;
            this.relations = commandData.relations;
        }       

    async execute(): Promise<void> {

        // Если это НЕ связующая таблица (т.е. обычная таблица)
        if (!this.isRelationTable) {
            console.log(`Обычная таблица: ${this.driftClassName}. Запуск стандартной генерации файлов.`);
            // data layer
            await this.generatorFactory.createDataRepositoryGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createModelGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createDaoGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createLocalSourcesGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createDataProviderGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

            //extensions
            await this.generatorFactory.createDataTableExtensionGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createDataModelExtensionGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

            // domain layer
            await this.generatorFactory.createEntityGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createDomainRepositoryGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createDomainProviderGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createDomainEntityExtensionGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createLocalDataSourceServiceGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

            // domain layer use_cases
            await this.generatorFactory.createUseCaseCreateGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createUseCaseUpdateGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createUseCaseDeleteGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createUseCaseGetByIdGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createUseCaseGetAllGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createUseCaseWatchAllGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

            //presentation layer
            await this.generatorFactory.createPresentStateProviderGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
            await this.generatorFactory.createPresentGetByIdProviderGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
        } else {
            // Если это связующая таблица "многие ко многим"
            const manyToManyRelation = this.relations.find(r => r.relationType === RelationType.MANY_TO_MANY);
            if (manyToManyRelation) {
                console.log(`Обнаружена связующая таблица: ${this.driftClassName}. Связывает ${manyToManyRelation.sourceTable} и ${manyToManyRelation.targetTable}.`);
                console.log(`Пропуск стандартной генерации большинства файлов для ${this.driftClassName}.`);

                // Генерируем специализированный DAO для связующей таблицы
                console.log(`Генерация DAO для связующей таблицы ${this.driftClassName} с использованием DataDaoRelateGenerator.`);
                await this.generatorFactory.createDaoRelateGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

                // Генерируем специализированный интерфейс LocalDataSource для связующей таблицы
                console.log(`Генерация интерфейса LocalDataSource для связующей таблицы ${this.driftClassName} с использованием DataLocalRelateDataSourceServiceGenerator.`);
                await this.generatorFactory.createDataLocalRelateDataSourceServiceGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

                // Генерируем реализацию LocalDataSource для связующей таблицы
                console.log(`Генерация реализации LocalDataSource для связующей таблицы ${this.driftClassName} с использованием DataLocalRelateSourceGenerator.`);
                await this.generatorFactory.createDataLocalRelateSourceGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

                   // Генерируем специализированный интерфейс Domain Repository для связующей таблицы
                console.log(`Генерация интерфейса Domain Repository для связующей таблицы ${this.driftClassName} с использованием DomainRelateRepositoryGenerator.`);
                await this.generatorFactory.createDomainRelateRepositoryGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
                
                // Генерируем реализацию Data Repository для связующей таблицы
                console.log(`Генерация реализации Data Repository для связующей таблицы ${this.driftClassName} с использованием DataRepositoryRelateImplGenerator.`);
                await this.generatorFactory.createDataRepositoryRelateImplGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
                
                      // Генерируем файл с провайдерами для связующей таблицы
                console.log(`Генерация файла провайдеров для связующей таблицы ${this.driftClassName} с использованием DataProviderRelateGenerator.`);
                await this.generatorFactory.createDataProviderRelateGenerator().generate(this.featurePath, this.driftClassName, this.classParser);
                
                // Генерируем UseCase для добавления связи
                console.log(`Генерация UseCase "add relation" для связующей таблицы ${this.driftClassName} с использованием UseCaseRelateAddGenerator.`);
                await this.generatorFactory.createUseCaseRelateAddGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

                // Генерируем UseCase для получения связанных сущностей (targets for source)
                console.log(`Генерация UseCase "get targets for source" для связующей таблицы ${this.driftClassName} с использованием UseCaseRelateGetTargetsForSourceGenerator.`);
                await this.generatorFactory.createUseCaseRelateGetTargetsForSourceGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

                // Генерируем UseCase для получения связанных сущностей (sources with target)
                console.log(`Генерация UseCase "get sources with target" для связующей таблицы ${this.driftClassName} с использованием UseCaseRelateGetSourcesWithTargetGenerator.`);
                await this.generatorFactory.createUseCaseRelateGetSourcesWithTargetGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

                // Генерируем UseCase для удаления всех связей (targets from source)
                console.log(`Генерация UseCase "remove all targets from source" для связующей таблицы ${this.driftClassName} с использованием UseCaseRelateRemoveAllTargetsFromSourceGenerator.`);
                await this.generatorFactory.createUseCaseRelateRemoveAllTargetsFromSourceGenerator().generate(this.featurePath, this.driftClassName, this.classParser);

                 // Генерируем UseCase для удаления конкретной связи (target from source)
                console.log(`Генерация UseCase "remove target from source" для связующей таблицы ${this.driftClassName} с использованием UseCaseRelateRemoveTargetFromSourceGenerator.`);
                await this.generatorFactory.createUseCaseRelateRemoveTargetFromSourceGenerator().generate(this.featurePath, this.driftClassName, this.classParser);


                 // Генерируем провайдеры для "relate" use cases
                const sourceTable = manyToManyRelation.sourceTable;
                const targetTable = manyToManyRelation.targetTable;
                const relationName = `${toPascalCase(sourceTable)}${toPascalCase(targetTable)}`; // e.g., TaskTag
                console.log(`Генерация UseCase Providers для связей ${relationName} (из таблицы ${this.driftClassName}) с использованием UseCaseRelateProvidersGenerator.`);
                await this.generatorFactory.createUseCaseRelateProvidersGenerator().generate(this.featurePath, relationName, this.classParser);


            } else {
                 console.warn(`Таблица ${this.driftClassName} определена как связующая (isRelationTable=true), но детали связи MANY_TO_MANY не найдены в relations. Проверьте логику DriftTableParser.`);
            }
        }
        // Здесь мог бы быть код, который выполняется для ВСЕХ типов таблиц,
        // но судя по всему, его нет, и это нормально.
    }
}