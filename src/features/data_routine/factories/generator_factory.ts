import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { DataDaoGenerator } from "../feature/data/datasources/local/dao/data_local_dao_dart";
import { DataSourcesGenerator } from "../feature/data/datasources/local/sources/local_data_source_dart";
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

    createDaoGenerator(): FileGenerator {
        return new DataDaoGenerator(this.fileSystem);       
    }

    createLocalSourcesGenerator(): FileGenerator {
        return new  DataSourcesGenerator(this.fileSystem);       
    }
}


