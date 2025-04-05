import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { DataDaoGenerator } from "../feature/data/datasources/local/dao/data_local_dao_dart";
import { DataSourcesGenerator } from "../feature/data/datasources/local/sources/local_data_source_dart";
import { DataModelGenerator } from "../feature/data/models/data_model_generator";
import { DataProviderGenerator } from "../feature/data/providers/data_prov_generator";
import { DataRepositoryGenerator } from "../feature/data/repositories/data_repository_generator";
import { EntityGenerator } from "../feature/domain/entities/entity_generator";
import { DomainProviderGenerator } from "../feature/domain/providers/domain_prov_generator";
import { DomainRepositoryGenerator } from "../feature/domain/repositories/domain_repository_generator";
import { UseCaseCreateGenerator } from "../feature/domain/usecases/use_case_create_generator";
import { UseCaseDeleteGenerator } from "../feature/domain/usecases/use_case_delete_generator";
import { UseCaseGetByIdGenerator } from "../feature/domain/usecases/use_case_get_by_id_generator";
import { UseCaseGetAllGenerator } from "../feature/domain/usecases/use_case_get_generator copy";
import { UseCaseUpdateGenerator } from "../feature/domain/usecases/use_case_update_generator";
import { PresentProviderGenerator } from "../feature/presentation/providers/present_prov_generator";


export class GeneratorFactory {
    constructor(private fileSystem: IFileSystem) { }

    // data layer
    createModelGenerator(): FileGenerator {
        return new DataModelGenerator(this.fileSystem);
    }

    createDaoGenerator(): FileGenerator {
        return new DataDaoGenerator(this.fileSystem);
    }

    createLocalSourcesGenerator(): FileGenerator {
        return new DataSourcesGenerator(this.fileSystem);
    }

    createDataProviderGenerator(): FileGenerator {
        return new DataProviderGenerator(this.fileSystem);

    }

    createDataRepositoryGenerator(): FileGenerator {
        return new DataRepositoryGenerator(this.fileSystem);
    }
    
    
    // domain layer
    createEntityGenerator(): FileGenerator {
        return new EntityGenerator(this.fileSystem);
    }
    createDomainRepositoryGenerator(): FileGenerator {
        return new DomainRepositoryGenerator(this.fileSystem);
    }

    createDomainProviderGenerator(): FileGenerator {
        return new DomainProviderGenerator(this.fileSystem);
    }

    // domain layer / usecases

    createUseCaseCreateGenerator():FileGenerator {
       return new UseCaseCreateGenerator(this.fileSystem);              
    }
    createUseCaseUpdateGenerator():FileGenerator {
        return new UseCaseUpdateGenerator(this.fileSystem);              
     }
     createUseCaseGetByIdGenerator():FileGenerator {
        return new UseCaseGetByIdGenerator(this.fileSystem);              
     }
     createUseCaseGetAllGenerator():FileGenerator {
        return new UseCaseGetAllGenerator(this.fileSystem);              
     }
     createUseCaseDeleteGenerator():FileGenerator {
        return new UseCaseDeleteGenerator(this.fileSystem);              
     }

    // presentation layer
    createPresentProviderGenerator(): FileGenerator {
        return new PresentProviderGenerator(this.fileSystem);
    }
    
    
}


