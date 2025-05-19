import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { DataDaoGenerator } from "../feature/data/datasources/local/dao/data_local_dao_generator";
import { DataDaoRelateGenerator } from "../feature/data/datasources/local/dao/data_local_dao_relate_generator";
import { LocalDataSourceServiceGenerator } from "../feature/data/datasources/local/interfaces/i_local_datasource_service";
import { DataLocalRelateDataSourceServiceGenerator } from "../feature/data/datasources/local/interfaces/i_local_relate_datasource_service";
import { DataLocalRelateSourceGenerator } from "../feature/data/datasources/local/sources/local_data_relate_source_generator";
import { DataSourcesGenerator } from "../feature/data/datasources/local/sources/local_data_source_generator";
import { TableExtensionGenerator } from "../feature/data/datasources/local/tables/extensions/table_extension_generator";
import { ModelGenerator } from "../feature/data/models/data_model_generator";
import { DataExtensionModelGenerator } from "../feature/data/models/extension_model_generator";
import { DataProviderGenerator } from "../feature/data/providers/data_prov_generator";
import { DataProviderRelateGenerator } from "../feature/data/providers/data_provider_relate_generator";
import { DataRepositoryGenerator } from "../feature/data/repositories/data_repository_generator";
import { DataRepositoryRelateImplGenerator } from "../feature/data/repositories/data_repository_relate_impl_generator";
import { DomainExtensionEntityGenerator } from "../feature/domain/entities/entity_extension_generator";
import { EntityGenerator } from "../feature/domain/entities/entity_generator";
import { UseCaseRelateProvidersGenerator } from "../feature/domain/providers/use_case_relate_providers_generator";
import { UseCaseProvidersGenerator } from "../feature/domain/providers/usecase_providers_generator";
import { DomainRelateRepositoryGenerator } from "../feature/domain/repositories/domain_relate_repository_generator";
import { DomainRepositoryGenerator } from "../feature/domain/repositories/domain_repository_generator";
import { UseCaseRelateAddGenerator } from "../feature/domain/usecases/relate/use_case_relate_add_target_to_source_generator";
import { UseCaseRelateGetSourcesWithTargetGenerator } from "../feature/domain/usecases/relate/use_case_relate_get_sources_with_target_generator";
import { UseCaseRelateGetTargetsForSourceGenerator } from "../feature/domain/usecases/relate/use_case_relate_get_targets_for_source_generator";
import { UseCaseRelateRemoveAllTargetsFromSourceGenerator } from "../feature/domain/usecases/relate/use_case_relate_remove_all_targets_from_source_generator";
import { UseCaseRelateRemoveTargetFromSourceGenerator } from "../feature/domain/usecases/relate/use_case_relate_remove_target_from_source_generator";
import { UseCaseCreateGenerator } from "../feature/domain/usecases/use_case_create_generator";
import { UseCaseDeleteGenerator } from "../feature/domain/usecases/use_case_delete_generator";
import { UseCaseGetAllGenerator } from "../feature/domain/usecases/use_case_get_all_generator";
import { UseCaseGetByIdGenerator } from "../feature/domain/usecases/use_case_get_by_id_generator";
import { UseCaseUpdateGenerator } from "../feature/domain/usecases/use_case_update_generator";
import { UseCaseWatchAllGenerator } from "../feature/domain/usecases/use_case_watch_all_generator";
import { PresentGetByIdProviderGenerator } from "../feature/presentation/providers/present_get_by_id_prov_generator";
import { PresentStateProviderGenerator } from "../feature/presentation/providers/present_state_prov_generator";
import { PresentStateRelateProviderGenerator } from "../feature/presentation/providers/present_state_relate_provider_generator";


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

    createDataLocalRelateSourceGenerator(): FileGenerator {
        return new DataLocalRelateSourceGenerator(this.fileSystem);
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

    createDataLocalRelateDataSourceServiceGenerator(): FileGenerator {
        return new DataLocalRelateDataSourceServiceGenerator(this.fileSystem);
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

    createUseCaseRelateAddGenerator(): FileGenerator {
        return new UseCaseRelateAddGenerator(this.fileSystem);
    }

    createUseCaseRelateGetTargetsForSourceGenerator(): FileGenerator {
        return new UseCaseRelateGetTargetsForSourceGenerator(this.fileSystem);
    }

    createUseCaseRelateGetSourcesWithTargetGenerator(): FileGenerator {
        return new UseCaseRelateGetSourcesWithTargetGenerator(this.fileSystem);
    }

    createUseCaseRelateRemoveAllTargetsFromSourceGenerator(): FileGenerator {
        return new UseCaseRelateRemoveAllTargetsFromSourceGenerator(this.fileSystem);
    }

    createUseCaseRelateRemoveTargetFromSourceGenerator(): FileGenerator {
        return new UseCaseRelateRemoveTargetFromSourceGenerator(this.fileSystem);
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

}
