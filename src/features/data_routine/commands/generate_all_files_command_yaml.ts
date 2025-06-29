import { Command } from "../../../core/interfaces/command";
import { toCamelCase } from "../../../utils/text_work/text_util";
import { GeneratorFactory } from "../factories/generator_factory";
import { ServerpodModel } from "../serverpod_yaml_parser/formatters/types";


export class GenerateAllFilesCommandYaml implements Command {
    private isRelationTable: boolean;

    constructor(
        private generatorFactory: GeneratorFactory,
        private featurePath: string,
        private model: ServerpodModel,
    ) {
        this.isRelationTable = this.model.fields.every(field => field.isRelation);

    }

    async execute(): Promise<void> {
        // Имя сущности (в PascalCase) берем напрямую из модели
        const entityName = toCamelCase(this.model.className);

        // Передаем во все генераторы объект модели (this.model)
        if (!this.isRelationTable) {
            console.log(`Генерация файлов для обычной таблицы: ${entityName}`);

            // data layer
            await this.generatorFactory.createDriftTableGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDaoGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createModelGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createLocalDataSourceServiceGenerator().generate(this.featurePath, entityName, this.model);
            // // remote
            await this.generatorFactory.createRemoteDataSourceServiceGenerator().generate(this.featurePath, entityName, this.model);

            await this.generatorFactory.createLocalSourcesGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createRemoteSourcesGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDataProviderGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createRemoteDataProviderGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDataRepositoryGenerator().generate(this.featurePath, entityName, this.model);

            //extensions
            await this.generatorFactory.createDataTableExtensionGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDataModelExtensionGenerator().generate(this.featurePath, entityName, this.model);

            // // domain layer
            await this.generatorFactory.createEntityGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDomainEntityExtensionGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDomainRepositoryGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDomainProviderGenerator().generate(this.featurePath, entityName, this.model);

            // // domain layer use_cases
            await this.generatorFactory.createUseCaseBaseGenerator().generate(this.featurePath, entityName, this.model);

            // const hasForeignKey = this.model.fields.some(field => field.isRelation && field.relationType === 'manyToOne');
            // if (hasForeignKey) {
            //     await this.generatorFactory.createUseCaseGetByForeignKeyGenerator().generate(this.featurePath, entityName, this.model);
            // }

            //presentation layer
            await this.generatorFactory.createPresentStateProviderGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createPresentGetByIdProviderGenerator().generate(this.featurePath, entityName, this.model);

        } else {
            console.log(`Обнаружена связующая таблица: ${entityName}.`);
            // Data Layer
            await this.generatorFactory.createDriftTableGenerator().generate(this.featurePath, entityName, this.model); // Таблица для связей
            // await this.generatorFactory.createDaoRelateGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataLocalRelateDataSourceServiceGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataLocalRelateSourceGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataRepositoryRelateImplGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataProviderRelateGenerator().generate(this.featurePath, entityName, this.model);
            
            // // Domain Layer
            // await this.generatorFactory.createDomainRelateRepositoryGenerator().generate(this.featurePath, entityName, this.model);
            
            // // Domain Layer - Use Cases for relations
            // await this.generatorFactory.createUseCaseRelateAddTargetToSourceGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createUseCaseRelateGetTargetsForSourceGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createUseCaseRelateRemoveTargetFromSourceGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createUseCaseRelateRemoveAllTargetsFromSourceGenerator().generate(this.featurePath, entityName, this.model);

            // // Domain Layer - Providers for Use Cases
            // await this.generatorFactory.createUseCaseRelateProvidersGenerator().generate(this.featurePath, entityName, this.model);

            // // Presentation Layer
            // await this.generatorFactory.createPresentStateRelateProviderGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createPresentFilterRelateProviderGenerator().generate(this.featurePath, entityName, this.model);
        }

    }
}