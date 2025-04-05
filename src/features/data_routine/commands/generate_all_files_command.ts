import { Command } from "../../../core/interfaces/command";
import { GeneratorFactory } from "../factories/generator_factory";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";


export class GenerateAllFilesCommand implements Command {

    constructor(private generatorFactory: GeneratorFactory, private featurePath: string, private driftClassName: string, private parser: DriftClassParser) { }

    async execute(): Promise<void> {
        await this.generatorFactory.createEntityGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createDataRepositoryGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createDomainRepositoryGenerator().generate(this.featurePath, this.driftClassName, this.parser);

        await this.generatorFactory.createModelGenerator().generate(this.featurePath, this.driftClassName, this.parser);        

        await this.generatorFactory.createDaoGenerator().generate(this.featurePath, this.driftClassName, this.parser); 
        
        await this.generatorFactory.createLocalSourcesGenerator().generate(this.featurePath, this.driftClassName, this.parser);
        
    }
}
