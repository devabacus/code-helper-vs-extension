import assert from "assert";
import path from "path";
import { testDatabaseServiceExample } from "./test_database_service_example";
import { TestDatabaseService } from "../../../../../../../../features/data_routine/test/core/database/local/test_database_service_generator";
import { MockFileSystem } from "../../../../../../../mocks/mock_file_system";

suite('TestDatabaseServiceGenerator', () => {

    const mockFileSystem = new MockFileSystem();

    const testDatabaseService = new TestDatabaseService(mockFileSystem);

    test('TestDatabaseServiceGenerator', () => {

        const expectedPath = path.join("test", "core", "database", "local", "test_database_service.dart");

        testDatabaseService.generate('', 'project_name');

        const mockFile = mockFileSystem.createdFiles[expectedPath].trim();

        assert.ok(mockFile, 'Файл должен быть создан');
        assert.strictEqual(mockFile, testDatabaseServiceExample);

    });

});





