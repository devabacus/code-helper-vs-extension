import { Command } from "../../../core/interfaces/command";
import { toCamelCase } from "../../../utils/text_work/text_util";
import { GeneratorFactory } from "../factories/generator_factory";
import { ServerpodModel } from "../serverpod_yaml_parser/formatters/types";


export class GenerateAllFilesCommandYaml implements Command {

    constructor(
        private generatorFactory: GeneratorFactory,
        private featurePath: string,
        private model: ServerpodModel,
    ) { }

    async execute(): Promise<void> {
        // Имя сущности (в PascalCase) берем напрямую из модели
        const entityName = toCamelCase(this.model.className);

        // model entity
        await this.generatorFactory.createModelGenerator().generate(this.featurePath, entityName, this.model);
        await this.generatorFactory.createEntityGenerator().generate(this.featurePath, entityName, this.model);

        // extensions
        await this.generatorFactory.createDataTableExtensionGenerator().generate(this.featurePath, entityName, this.model);

        await this.generatorFactory.createDataModelExtensionGenerator().generate(this.featurePath, entityName, this.model);

        await this.generatorFactory.createDomainEntityExtensionGenerator().generate(this.featurePath, entityName, this.model);


        // Передаем во все генераторы объект модели (this.model)
        if (!this.model.isRelation) {
            console.log(`Генерация файлов для обычной таблицы: ${entityName}`);


            // server
            await this.generatorFactory.createServerpodEndpointGenerator().generate(this.featurePath, entityName, this.model);
            
            

            // data layer
            await this.generatorFactory.createDriftTableGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDaoGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createLocalSourceServiceGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createLocalSourcesGenerator().generate(this.featurePath, entityName, this.model);

            // // remote
            await this.generatorFactory.createRemoteSourceServiceGenerator().generate(this.featurePath, entityName, this.model);


            await this.generatorFactory.createRemoteSourcesGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDataProviderGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createRemoteDataProviderGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDataRepositoryGenerator().generate(this.featurePath, entityName, this.model);

            // // domain layer
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
            // server
            await this.generatorFactory.createServerpodRelateEndpointGenerator().generate(this.featurePath, entityName, this.model);

            // Data Layer
            await this.generatorFactory.createDriftRelateTableGenerator().generate(this.featurePath, entityName, this.model); // Таблица для связей
            await this.generatorFactory.createDaoRelateGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDataLocalRelateServiceGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createLocalRelateSourceGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createRemoteRelateSourceServiceGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createRemoteRelateSourcesGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDataProviderRelateGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDataRepositoryRelateImplGenerator().generate(this.featurePath, entityName, this.model);

            // // Domain Layer
            await this.generatorFactory.createDomainRelateRepositoryGenerator().generate(this.featurePath, entityName, this.model);


            // // Domain Layer - Use Cases for relations
            await this.generatorFactory.createUseCaseRelateGenerator().generate(this.featurePath, entityName, this.model);

            // Domain Layer - Providers for Use Cases
            await this.generatorFactory.createUseCaseRelateProvidersGenerator().generate(this.featurePath, entityName, this.model);

            // // Presentation Layer
            await this.generatorFactory.createPresentStateRelateProviderGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createPresentFilterRelateProviderGenerator().generate(this.featurePath, entityName, this.model);
        }

    }
}