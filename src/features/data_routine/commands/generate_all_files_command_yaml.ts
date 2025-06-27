import { Command } from "../../../core/interfaces/command";
import { toPascalCase } from "../../../utils/text_work/text_util";
import { GeneratorFactory } from "../factories/generator_factory";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../feature/data/datasources/local/tables/drift_table_parser"; // Добавлен импорт
import { RelationType, TableRelation } from "../interfaces/table_relation.interface";
import { ServerpodModel } from "../serverpod_yaml_parser/types";


export class GenerateAllFilesCommandYaml implements Command {
    private isRelationTable: boolean;
    
    constructor(
        private generatorFactory: GeneratorFactory,
        private featurePath: string,
        private model: ServerpodModel,
    )
     {
        this.isRelationTable = this.model.fields.every(field => field.isRelation);

     }

    async execute(): Promise<void> {
        // Имя сущности (в PascalCase) берем напрямую из модели
        const entityName = this.model.className;

        // Передаем во все генераторы объект модели (this.model)
        if (!this.isRelationTable) {
            console.log(`Генерация файлов для обычной таблицы: ${entityName}`);
            
            // data layer
            await this.generatorFactory.createDriftTableGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createDaoGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createModelGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createLocalDataSourceServiceGenerator().generate(this.featurePath, entityName, this.model);
            await this.generatorFactory.createLocalSourcesGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataProviderGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataRepositoryGenerator().generate(this.featurePath, entityName, this.model);

            //extensions
            await this.generatorFactory.createDataTableExtensionGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataModelExtensionGenerator().generate(this.featurePath, entityName, this.model);

            // // domain layer
            // await this.generatorFactory.createEntityGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDomainRepositoryGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDomainProviderGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDomainEntityExtensionGenerator().generate(this.featurePath, entityName, this.model);
            
            // // domain layer use_cases
            // await this.generatorFactory.createUseCaseCreateGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createUseCaseUpdateGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createUseCaseDeleteGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createUseCaseGetByIdGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createUseCaseGetAllGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createUseCaseWatchAllGenerator().generate(this.featurePath, entityName, this.model);
            
            // const hasForeignKey = this.model.fields.some(field => field.isRelation && field.relationType === 'manyToOne');
            // if (hasForeignKey) {
            //     await this.generatorFactory.createUseCaseGetByForeignKeyGenerator().generate(this.featurePath, entityName, this.model);
            // }

            // //presentation layer
            // await this.generatorFactory.createPresentStateProviderGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createPresentGetByIdProviderGenerator().generate(this.featurePath, entityName, this.model);

        } else {
            console.log(`Обнаружена связующая таблица: ${entityName}.`);
            // await this.generatorFactory.createDaoRelateGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataLocalRelateDataSourceServiceGenerator().generate(this.featurePath, entityName, this.model);
            // await this.generatorFactory.createDataLocalRelateSourceGenerator().generate(this.featurePath, entityName, this.model);
            // ... и так далее для остальных генераторов таблиц-связок
        }
    
    }
}