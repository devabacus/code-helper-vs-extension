import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { TestDaoGenerator } from "../test/feature/data/datasources/local/dao/test_dao_generator";
import { TestLocalSourceGenerator } from "../test/feature/data/datasources/local/sources/test_local_source_generator";
import { TestRepositoryImplGenerator } from "../test/feature/data/repositories/test_repository_impl_generator";
import { TestUseCaseCreateGenerator } from "../test/feature/domain/usecases/test_usecase_create_generator";
import { TestUseCaseDeleteGenerator } from "../test/feature/domain/usecases/test_usecase_delete_generator";
import { TestUseCaseGetByIdGenerator } from "../test/feature/domain/usecases/test_usecase_get_by_id_generator";
import { TestUseCaseGetListGenerator } from "../test/feature/domain/usecases/test_usecase_get_list_generator";
import { TestUseCaseUpdateGenerator } from "../test/feature/domain/usecases/test_usecase_update_generator";



export class DartTestGeneratorFactory {

    constructor(private fileSystem: IFileSystem) { }

    createTestDaoGenerator(): FileGenerator {
        return new TestDaoGenerator(this.fileSystem);
    }

    createTestLocalSourceGenerator(): FileGenerator {
        return new TestLocalSourceGenerator(this.fileSystem);
    }

    createTestRepositoryImplGenerator(): FileGenerator {
        return new TestRepositoryImplGenerator(this.fileSystem);
    }

    createTestUseCasesCreateGenerator(): FileGenerator {
        return new TestUseCaseCreateGenerator(this.fileSystem);
    }

    createTestUseCasesDeleteGenerator(): FileGenerator {
        return new TestUseCaseDeleteGenerator(this.fileSystem);
    }

    createTestUseCasesUpdateGenerator(): FileGenerator {
        return new TestUseCaseUpdateGenerator(this.fileSystem);
    }

    createTestUseCasesGetByIdGenerator(): FileGenerator {
        return new TestUseCaseGetByIdGenerator(this.fileSystem);
    }

    createTestUseCasesGetListGenerator(): FileGenerator {
        return new TestUseCaseGetListGenerator(this.fileSystem);
    }

    // createTestUseCasesWatchAllGenerator(): FileGenerator {
    //     return new TestUseCaseGetListGenerator(this.fileSystem);
    // }
}

