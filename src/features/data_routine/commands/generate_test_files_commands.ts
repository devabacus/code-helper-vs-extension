import { Command } from "../../../core/interfaces/command";
import { DartTestGeneratorFactory } from "../factories/test_generator_factory";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";

export class GenerateTestFilesCommand implements Command {
    
    constructor(private testGeneratorFactory: DartTestGeneratorFactory, private featureTestPath: string, private driftClassName: string, private parser: DriftClassParser) { }

    async execute(): Promise<void> {

        await this.testGeneratorFactory.createTestDaoGenerator().generate(this.featureTestPath, this.driftClassName, this.parser);

        await this.testGeneratorFactory.createTestLocalSourceGenerator().generate(this.featureTestPath, this.driftClassName, this.parser);

        await this.testGeneratorFactory.createTestRepositoryImplGenerator().generate(this.featureTestPath, this.driftClassName, this.parser);

        await this.testGeneratorFactory.createTestUseCasesCreateGenerator().generate(this.featureTestPath, this.driftClassName, this.parser);

        await this.testGeneratorFactory.createTestUseCasesDeleteGenerator().generate(this.featureTestPath, this.driftClassName, this.parser);

        await this.testGeneratorFactory.createTestUseCasesUpdateGenerator().generate(this.featureTestPath, this.driftClassName, this.parser);

        await this.testGeneratorFactory.createTestUseCasesGetByIdGenerator().generate(this.featureTestPath, this.driftClassName, this.parser);

        await this.testGeneratorFactory.createTestUseCasesGetListGenerator().generate(this.featureTestPath, this.driftClassName, this.parser);
    }
}

