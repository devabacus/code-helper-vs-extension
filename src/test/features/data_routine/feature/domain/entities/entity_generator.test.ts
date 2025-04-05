import path from "path";
import { DriftClassParser } from "../../../../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";
import { EntityGenerator } from "../../../../../../features/data_routine/feature/domain/entities/entity_generator";
import { MockFileSystem } from "../../../../../mocks/mock_file_system";
import { tableCategory } from "../../data/datasources/local/tables/drift_class_examples";
import assert from "assert";
import { entityCategoryExample } from "./entity_example";


suite('EntityGenerator', () => {

    let mockFileSystem: MockFileSystem;
    let entityGenerator: EntityGenerator;
    let parser: DriftClassParser;

    setup(() => {
        mockFileSystem = new MockFileSystem();
        entityGenerator = new EntityGenerator(mockFileSystem);
        parser = new DriftClassParser(tableCategory);
    });

    test('должен сгенерироваться entity файл с правильным контентом и по правильному пути', async () => {
        const featurePath = path.join("test", "feature");
        const entityName = "category";

        await entityGenerator.generate(featurePath, entityName, parser);
        const expectedPath = path.join(featurePath, "domain", "entities", "category.dart");

        assert.ok(mockFileSystem.createdFiles[expectedPath], 'должен быть создан');
        assert.strictEqual(mockFileSystem.createdFiles[expectedPath].trim(), entityCategoryExample.trim());

    });

});
