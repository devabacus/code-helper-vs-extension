import assert from "assert";
import { FileGenerator } from "../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../core/interfaces/file_system";
import { MockFileSystem } from "../../../mocks/mock_file_system";
import { TestDataFactory } from "../fixtures/test_data_factory";
import path from "path";
import { IPathHandle } from "../../../../features/utils/path_util";



export abstract class BaseDataRoutineGeneratorTest {

    protected mockFileSystem!: MockFileSystem;
    protected abstract createGenerator(fileSystem: IFileSystem): FileGenerator
    protected abstract getExpectedPath(basePath: string, entityName: string): string;


    get defaultFeaturePath(): string {
        return path.join("test", "feature");
    }

    get defaultTestFeaturePath(): string {
        return path.join("test", "test", "feature");
    }

    setup() {
        this.mockFileSystem = new MockFileSystem();
    }

    async testGenerator(featurePath: string, entityName: string, expectedContent: string) {

        const effectiveBasePath = featurePath || this.defaultFeaturePath;
        

        const generator = this.createGenerator(this.mockFileSystem);
        const parser = TestDataFactory.createDriftClassParser(entityName);

        await generator.generate(effectiveBasePath, entityName, parser);

        const expectedPath = this.getExpectedPath(effectiveBasePath, entityName);
        assert.ok(this.mockFileSystem.createdFiles[expectedPath], 'Файл должен быть создан');
        assert.strictEqual(this.mockFileSystem.createdFiles[expectedPath].trim(), expectedContent.trim());
    }
}
