import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { DataModelGenerator } from "../feature/data/models/data_model_generator";
import { DataRepositoryGenerator } from "../feature/data/repositories/data_repository_generator";
import { EntityGenerator } from "../feature/domain/entities/entity_generator";
import { DomainRepositoryGenerator } from "../feature/domain/repositories/domain_repository_generator";



export class GeneratorFactory {
    constructor(private fileSystem: IFileSystem) { }

    createEntityGenerator(): FileGenerator {
        return new EntityGenerator(this.fileSystem);
    }

    createDataRepositoryGenerator(): FileGenerator {
        return new DataRepositoryGenerator(this.fileSystem);
    }

    createDomainRepositoryGenerator(): FileGenerator {
        return new DomainRepositoryGenerator(this.fileSystem);
    }

    createModelGenerator():FileGenerator {
        return new DataModelGenerator(this.fileSystem);
    }
}
