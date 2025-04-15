import assert from "assert";
import { FileGenerator } from "../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../core/interfaces/file_system";
import { MockFileSystem } from "../../../mocks/mock_file_system";
import { TestDataFactory } from "../fixtures/test_data_factory";
import path from "path";



export abstract class BaseDataRoutineGeneratorTest {
   
    protected mockFileSystem!: MockFileSystem;
    protected abstract createGenerator(fileSystem: IFileSystem): FileGenerator
    protected abstract getExpectedPath(featurePath: string, entityName: string): string;
    

    get defaultFeaturePath() : string {
        return path.join("test", "feature");
    }

    setup(){
        this.mockFileSystem = new MockFileSystem();
    }

    async testGenerator(featurePath: string, entityName: string, expectedContent: string) {
        
        const effectiveFeaturePath = featurePath || this.defaultFeaturePath;


        const generator = this.createGenerator(this.mockFileSystem);
        const parser = TestDataFactory.createDriftClassParser(entityName);
        
        await generator.generate(effectiveFeaturePath, entityName, parser);

        const expectedPath = this.getExpectedPath(effectiveFeaturePath, entityName);
        assert.ok(this.mockFileSystem.createdFiles[expectedPath], 'Файл должен быть создан');
        assert.strictEqual(this.mockFileSystem.createdFiles[expectedPath].trim(), expectedContent.trim());
    }    
}
