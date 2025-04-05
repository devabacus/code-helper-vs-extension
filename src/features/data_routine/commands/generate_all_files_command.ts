import { Command } from "../../../core/interfaces/command";
import { GeneratorFactory } from "../factories/generator_factory";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";


export class GenerateAllFilesCommand implements Command {

    constructor(private generatorFactory: GeneratorFactory, private featurePath: string, private driftClassName: string, private parser: DriftClassParser) { }

    async execute(): Promise<void> {
        
        // data layer
        await this.generatorFactory.createDataRepositoryGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createModelGenerator().generate(this.featurePath, this.driftClassName, this.parser);        

        await this.generatorFactory.createDaoGenerator().generate(this.featurePath, this.driftClassName, this.parser); 
        
        await this.generatorFactory.createLocalSourcesGenerator().generate(this.featurePath, this.driftClassName, this.parser);
                
        await this.generatorFactory.createDataProviderGenerator().generate(this.featurePath, this.driftClassName, this.parser);
        
        // domain layer
        await this.generatorFactory.createEntityGenerator().generate(this.featurePath, this.driftClassName, this.parser);
        
        await this.generatorFactory.createDomainRepositoryGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createDomainProviderGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        // domain layer use_cases
        await this.generatorFactory.createUseCaseCreateGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createUseCaseUpdateGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createUseCaseDeleteGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createUseCaseGetByIdGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createUseCaseGetAllGenerator().generate(this.featurePath, this.driftClassName, this.parser);




        //presentation layer
        await this.generatorFactory.createPresentProviderGenerator().generate(this.featurePath, this.driftClassName, this.parser);

    }
}
