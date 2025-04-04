import { FileGenerator } from "../../../core/interfaces/file_generator";
import { FileSystem } from "../../../core/interfaces/file_system";
import { EntityGenerator } from "../generators/entity_generator";
import { RepositoryGenerator } from "../generators/repository_generator";



export class GeneratorFactory {
    constructor(private fileSystem: FileSystem){}

    createEntityGenerator(): FileGenerator {
        return new EntityGenerator(this.fileSystem);
    }

    createRepositoryGenerator(): FileGenerator {
        return new RepositoryGenerator(this.fileSystem);
    }

}
