import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { DataDaoGenerator } from "../feature/data/datasources/local/dao/data_local_dao_generator";
import { DataDaoRelateGenerator } from "../feature/data/datasources/local/dao/data_local_dao_relate_generator";
import { LocalDataSourceServiceGenerator } from "../feature/data/datasources/local/interfaces/i_local_datasource_service";
import { DataLocalRelateServiceGenerator } from "../feature/data/datasources/local/interfaces/i_local_relate_datasource_service";
import { DataLocalRelateSourceGenerator } from "../feature/data/datasources/local/sources/local_data_relate_source_generator";
import { DataLocalSourcesGenerator } from "../feature/data/datasources/local/sources/local_data_source_generator";
import { DriftRelateTableGenerator } from "../feature/data/datasources/local/tables/drift_relate_table_generator";
import { DriftTableGenerator } from "../feature/data/datasources/local/tables/drift_table_generator";
import { TableExtensionGenerator } from "../feature/data/datasources/local/tables/extensions/table_extension_generator";
import { RemoteRelateSourceServiceGenerator } from "../feature/data/datasources/remote/interfaces/i_remote_datasource_relate_service";
import { RemoteDataSourceServiceGenerator as RemoteSourceServiceGenerator } from "../feature/data/datasources/remote/interfaces/i_remote_datasource_service";
import { DataRemoteSourcesGenerator } from "../feature/data/datasources/remote/sources/remote_datasource_generator";
import { ModelGenerator } from "../feature/data/models/data_model_generator";
import { DataExtensionModelGenerator } from "../feature/data/models/extension_model_generator";
import { DataProviderGenerator } from "../feature/data/providers/data_prov_generator";
import { DataProviderRelateGenerator } from "../feature/data/providers/data_provider_relate_generator";
import { RemoteDataProviderGenerator } from "../feature/data/providers/remote_data_prov_generator";
import { DataRepositoryGenerator } from "../feature/data/repositories/data_repository_generator";
import { DataRepositoryRelateImplGenerator } from "../feature/data/repositories/data_repository_relate_impl_generator";
import { DomainExtensionEntityGenerator } from "../feature/domain/entities/entity_extension_generator";
import { EntityGenerator } from "../feature/domain/entities/entity_generator";
import { UseCaseRelateProvidersGenerator } from "../feature/domain/providers/use_case_relate_providers_generator";
import { UseCaseProvidersGenerator } from "../feature/domain/providers/usecase_providers_generator";
import { DomainRelateRepositoryGenerator } from "../feature/domain/repositories/domain_relate_repository_generator";
import { DomainRepositoryGenerator } from "../feature/domain/repositories/domain_repository_generator";

import { UseCaseBaseGenerator } from "../feature/domain/usecases/use_case_bundle_generator";
import { UseCaseRelateGenerator } from "../feature/domain/usecases/use_case_relate_generator";
import { PresentFilterRelateProviderGenerator } from "../feature/presentation/providers/present_filter_relate_provider_generator";
import { PresentGetByIdProviderGenerator } from "../feature/presentation/providers/present_get_by_id_prov_generator";
import { PresentStateProviderGenerator } from "../feature/presentation/providers/present_state_prov_generator";
import { PresentStateRelateProviderGenerator } from "../feature/presentation/providers/present_state_relate_provider_generator";



export class GeneratorFactory {
    constructor(private fileSystem: IFileSystem) { }

    // data layer
    createDriftTableGenerator(): FileGenerator {
        return new DriftTableGenerator(this.fileSystem);
    }

    createDriftRelateTableGenerator(): FileGenerator {
        return new DriftRelateTableGenerator(this.fileSystem);
    }

    createModelGenerator(): FileGenerator {
        return new ModelGenerator(this.fileSystem);
    }

    createDaoGenerator(): FileGenerator {
        return new DataDaoGenerator(this.fileSystem);
    }

    createDaoRelateGenerator(): FileGenerator {
        return new DataDaoRelateGenerator(this.fileSystem);
    }

    // local source 
    createLocalSourceServiceGenerator(): FileGenerator {
        return new LocalDataSourceServiceGenerator(this.fileSystem);
    }
    createLocalRelateSourceGenerator(): FileGenerator {
        return new DataLocalRelateSourceGenerator(this.fileSystem);
    }
    createLocalSourcesGenerator(): FileGenerator {
        return new DataLocalSourcesGenerator(this.fileSystem);
    }
    createDataRelateSourceGenerator(): FileGenerator {
        return new RemoteRelateSourceServiceGenerator(this.fileSystem);
    }

    // remote source
    createRemoteSourceServiceGenerator(): FileGenerator {
        return new RemoteSourceServiceGenerator(this.fileSystem);
    }

    createRemoteRelateSourceServiceGenerator(): FileGenerator {
        return new RemoteRelateSourceServiceGenerator(this.fileSystem);
    }










    createRemoteSourcesGenerator(): FileGenerator {
        return new DataRemoteSourcesGenerator(this.fileSystem);
    }


    createDataProviderGenerator(): FileGenerator {
        return new DataProviderGenerator(this.fileSystem);
    }
    createRemoteDataProviderGenerator(): FileGenerator {
        return new RemoteDataProviderGenerator(this.fileSystem);
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



    createDataLocalRelateServiceGenerator(): FileGenerator {
        return new DataLocalRelateServiceGenerator(this.fileSystem);
    }

    createDataRepositoryRelateImplGenerator(): FileGenerator {
        return new DataRepositoryRelateImplGenerator(this.fileSystem);
    }

    createDataProviderRelateGenerator(): FileGenerator {
        return new DataProviderRelateGenerator(this.fileSystem);
    }

    // domain layer
    createEntityGenerator(): FileGenerator {
        return new EntityGenerator(this.fileSystem);
    }
    createDomainRepositoryGenerator(): FileGenerator {
        return new DomainRepositoryGenerator(this.fileSystem);
    }

    createDomainRelateRepositoryGenerator(): FileGenerator {
        return new DomainRelateRepositoryGenerator(this.fileSystem);
    }

    createDomainProviderGenerator(): FileGenerator {
        return new UseCaseProvidersGenerator(this.fileSystem);
    }
    createDomainEntityExtensionGenerator(): FileGenerator {
        return new DomainExtensionEntityGenerator(this.fileSystem);
    }

    // domain layer / usecases

    createUseCaseBaseGenerator(): FileGenerator {
        return new UseCaseBaseGenerator(this.fileSystem);
    }
    createUseCaseRelateGenerator(): FileGenerator {
        return new UseCaseRelateGenerator(this.fileSystem);
    }


    // presentation layer
    createPresentStateProviderGenerator(): FileGenerator {
        return new PresentStateProviderGenerator(this.fileSystem);
    }

    createPresentGetByIdProviderGenerator(): FileGenerator {
        return new PresentGetByIdProviderGenerator(this.fileSystem);
    }

    createUseCaseRelateProvidersGenerator(): FileGenerator {
        return new UseCaseRelateProvidersGenerator(this.fileSystem);
    }

    createPresentStateRelateProviderGenerator(): PresentStateRelateProviderGenerator {
        return new PresentStateRelateProviderGenerator(this.fileSystem);
    }

    createPresentFilterRelateProviderGenerator(): PresentFilterRelateProviderGenerator {
        return new PresentFilterRelateProviderGenerator(this.fileSystem);
    }

}
