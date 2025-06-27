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
    private tableParser: DriftTableParser; 


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
    ) {
        this.classParser = commandData.classParser;
        this.tableParser = commandData.tableParser;
        this.isRelationTable = commandData.isRelationTable;
        this.relations = commandData.relations;
    }


    async execute(): Promise<void> {
        const entityNameForGenerators = this.driftClassName; // Используем camelCase имя для большинства генераторов

        const parsersData = { classParser: this.classParser, tableParser: this.tableParser };

        if (!this.isRelationTable) {
            console.log(`Обычная таблица: ${entityNameForGenerators}. Запуск стандартной генерации файлов.`);
            // data layer
            await this.generatorFactory.createDataRepositoryGenerator().generate(this.featurePath, entityNameForGenerators, parsersData);
            await this.generatorFactory.createModelGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDaoGenerator().generate(this.featurePath, entityNameForGenerators, parsersData);
            await this.generatorFactory.createLocalSourcesGenerator().generate(this.featurePath, entityNameForGenerators, parsersData);
            await this.generatorFactory.createDataProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);

            //extensions
            await this.generatorFactory.createDataTableExtensionGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDataModelExtensionGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);

            // domain layer
            await this.generatorFactory.createEntityGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createDomainRepositoryGenerator().generate(this.featurePath, entityNameForGenerators, parsersData);
            await this.generatorFactory.createDomainProviderGenerator().generate(this.featurePath, entityNameForGenerators, parsersData);
            await this.generatorFactory.createDomainEntityExtensionGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createLocalDataSourceServiceGenerator().generate(this.featurePath, entityNameForGenerators, parsersData);

            // domain layer use_cases
            await this.generatorFactory.createUseCaseCreateGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseUpdateGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseDeleteGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseGetByIdGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseGetAllGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createUseCaseWatchAllGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            if (this.tableParser.getReferences() && this.tableParser.getReferences().length > 0) {
                await this.generatorFactory.createUseCaseGetByForeignKeyGenerator().generate(this.featurePath, entityNameForGenerators, parsersData);
            }

            //presentation layer
            await this.generatorFactory.createPresentStateProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);
            await this.generatorFactory.createPresentGetByIdProviderGenerator().generate(this.featurePath, entityNameForGenerators, this.classParser);

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

            }
        }
    }
}