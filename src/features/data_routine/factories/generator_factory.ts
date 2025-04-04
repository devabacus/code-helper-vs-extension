import { FileGenerator } from "../../../core/interfaces/file_generator";
import { FileSystem } from "../../../core/interfaces/file_system";
import { DataRepositoryGenerator } from "../feature/data/repositories/data_repository_generator";
import { EntityGenerator } from "../feature/domain/entities/entity_generator";
import { DomainRepositoryGenerator } from "../feature/domain/repositories/domain_repository_generator";



export class GeneratorFactory {
    constructor(private fileSystem: FileSystem) { }

    createEntityGenerator(): FileGenerator {
        return new EntityGenerator(this.fileSystem);
    }

    createDataRepositoryGenerator(): FileGenerator {
        return new DataRepositoryGenerator(this.fileSystem);
    }

    createDomainRepositoryGenerator(): FileGenerator {
        return new DomainRepositoryGenerator(this.fileSystem);
    }

}
