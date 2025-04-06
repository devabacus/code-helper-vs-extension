import assert from "assert";
import { FileGenerator } from "../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../core/interfaces/file_system";
import { MockFileSystem } from "../../../mocks/mock_file_system";
import { TestDataFactory } from "../fixtures/test_data_factory";


export abstract class BaseDataRoutineGeneratorTest {
   
    // Изменяем с protected на public
    public mockFileSystem!: MockFileSystem;
    protected abstract createGenerator(fileSystem: IFileSystem): FileGenerator
    protected abstract getExpectedPath(featurePath: string, entityName: string): string;
    
    setup(){
        this.mockFileSystem = new MockFileSystem();
    }

    async testGenerator(featurePath: string, entityName: string, expectedContent: string) {
        const generator = this.createGenerator(this.mockFileSystem);
        const parser = TestDataFactory.createDriftClassParser(entityName);
        
        await generator.generate(featurePath, entityName, parser);

        const expectedPath = this.getExpectedPath(featurePath, entityName);
        assert.ok(this.mockFileSystem.createdFiles[expectedPath], 'Файл должен быть создан');
        assert.strictEqual(this.mockFileSystem.createdFiles[expectedPath].trim(), expectedContent.trim());
    }
    
    // Добавляем публичный метод для проверки
    public assertFileCreated(expectedPath: string, expectedContent: string): void {
      assert.ok(this.mockFileSystem.createdFiles[expectedPath], 'Файл должен быть создан');
      assert.strictEqual(
        this.mockFileSystem.createdFiles[expectedPath].trim(), 
        expectedContent.trim(),
        'Содержимое файла не соответствует ожидаемому'
      );
    }
}