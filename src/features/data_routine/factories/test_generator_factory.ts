import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { TestDatabaseService } from "../test/core/database/local/test_database_service_generator";



export class DartTestGeneratorFactory {

    constructor(private fileSystem: IFileSystem){}

    createTestDatabaseService() :FileGenerator{
        return new TestDatabaseService(this.fileSystem);
    }



}