import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { TestDaoGenerator } from "../test/feature/data/datasources/local/dao/test_dao_generator";
import { TestLocalSourceGenerator } from "../test/feature/data/datasources/local/sources/test_local_source_generator";



export class DartTestGeneratorFactory {

    constructor(private fileSystem: IFileSystem){}

    // createTestDatabaseService() :FileGenerator{
    //     return new TestDatabaseService(this.fileSystem);
    // }


    createTestDaoGenerator(): FileGenerator {
        return new TestDaoGenerator(this.fileSystem);
    }

    createTestLocalSourceGenerator(): FileGenerator {
        return new TestLocalSourceGenerator(this.fileSystem);
        
    }

}