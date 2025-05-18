import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { DataDaoGenerator } from "../feature/data/datasources/local/dao/data_local_dao_generator";
import { DataDaoRelateGenerator } from "../feature/data/datasources/local/dao/data_local_dao_relate_generator";
import { LocalDataSourceServiceGenerator } from "../feature/data/datasources/local/interfaces/i_local_datasource_service";
import { DataSourcesGenerator } from "../feature/data/datasources/local/sources/local_data_source_generator";
import { TableExtensionGenerator } from "../feature/data/datasources/local/tables/extensions/table_extension_generator";
import { ModelGenerator } from "../feature/data/models/data_model_generator";
import { DataExtensionModelGenerator } from "../feature/data/models/extension_model_generator";
import { DataProviderGenerator } from "../feature/data/providers/data_prov_generator";
import { DataRepositoryGenerator } from "../feature/data/repositories/data_repository_generator";
import { DomainExtensionEntityGenerator } from "../feature/domain/entities/entity_extension_generator";
import { EntityGenerator } from "../feature/domain/entities/entity_generator";
import { UseCaseProvidersGenerator } from "../feature/domain/providers/usecase_providers_generator";
import { DomainRepositoryGenerator } from "../feature/domain/repositories/domain_repository_generator";
import { UseCaseCreateGenerator } from "../feature/domain/usecases/use_case_create_generator";
import { UseCaseDeleteGenerator } from "../feature/domain/usecases/use_case_delete_generator";
import { UseCaseGetAllGenerator } from "../feature/domain/usecases/use_case_get_all_generator";
import { UseCaseGetByIdGenerator } from "../feature/domain/usecases/use_case_get_by_id_generator";
import { UseCaseUpdateGenerator } from "../feature/domain/usecases/use_case_update_generator";
import { UseCaseWatchAllGenerator } from "../feature/domain/usecases/use_case_watch_all_generator";
import { PresentGetByIdProviderGenerator } from "../feature/presentation/providers/present_get_by_id_prov_generator";
import { PresentStateProviderGenerator } from "../feature/presentation/providers/present_state_prov_generator";


export class GeneratorFactory {
    constructor(private fileSystem: IFileSystem) { }

    // data layer
    createModelGenerator(): FileGenerator {
        return new ModelGenerator(this.fileSystem);
    }

    createDaoGenerator(): FileGenerator {
        return new DataDaoGenerator(this.fileSystem);
    }

    createDaoRelateGenerator(): FileGenerator {
        return new DataDaoRelateGenerator(this.fileSystem);
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

    createDataTableExtensionGenerator(): FileGenerator {
        return new TableExtensionGenerator(this.fileSystem);
    }

    createDataModelExtensionGenerator(): FileGenerator {
        return new DataExtensionModelGenerator(this.fileSystem);
    }

    createLocalDataSourceServiceGenerator(): FileGenerator {
        return new LocalDataSourceServiceGenerator(this.fileSystem);
    }

    

    // domain layer
    createEntityGenerator(): FileGenerator {
        return new EntityGenerator(this.fileSystem);
    }
    createDomainRepositoryGenerator(): FileGenerator {
        return new DomainRepositoryGenerator(this.fileSystem);
    }

    createDomainProviderGenerator(): FileGenerator {
        return new UseCaseProvidersGenerator(this.fileSystem);
    }
    createDomainEntityExtensionGenerator(): FileGenerator {
        return new DomainExtensionEntityGenerator(this.fileSystem);
    }

    // domain layer / usecases

    createUseCaseCreateGenerator(): FileGenerator {
        return new UseCaseCreateGenerator(this.fileSystem);
    }
    createUseCaseUpdateGenerator(): FileGenerator {
        return new UseCaseUpdateGenerator(this.fileSystem);
    }
    createUseCaseGetByIdGenerator(): FileGenerator {
        return new UseCaseGetByIdGenerator(this.fileSystem);
    }
    createUseCaseGetAllGenerator(): FileGenerator {
        return new UseCaseGetAllGenerator(this.fileSystem);
    }
    createUseCaseDeleteGenerator(): FileGenerator {
        return new UseCaseDeleteGenerator(this.fileSystem);
    }

    createUseCaseWatchAllGenerator(): FileGenerator {
        return new UseCaseWatchAllGenerator(this.fileSystem);
    }

    // presentation layer
    createPresentStateProviderGenerator(): FileGenerator {
        return new PresentStateProviderGenerator(this.fileSystem);
    }

    createPresentGetByIdProviderGenerator(): FileGenerator {
        return new PresentGetByIdProviderGenerator(this.fileSystem);
    }


}


