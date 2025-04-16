import path from "path";
import { FileGenerator } from "../../../../../../../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../../../../../../../core/interfaces/file_system";

import { TableExtensionGenerator } from "../../../../../../../../../features/data_routine/feature/data/datasources/local/tables/extensions/table_extension_generator";
import { BaseDataRoutineGeneratorTest } from "../../../../../../generators/data_routine_generator.test";
import { categoryTabeExtension } from "./table_extensions_example";


suite('table extension generator', () => {

    class TableExtensionGeneratorTest extends BaseDataRoutineGeneratorTest {
        
        protected createGenerator(fileSystem: IFileSystem): FileGenerator {
            return new TableExtensionGenerator(fileSystem);
        }
        protected getExpectedPath(featurePath: string, entityName: string): string {
            return path.join(featurePath, "data", "datasources", "local", "tables", "extensions", `${entityName}_table_extension.dart`);
        }
    }

    const testInstance = new TableExtensionGeneratorTest();


    test('must correct generate category_table_extension.dart', async () => {
        testInstance.setup();
        await testInstance.testGenerator(testInstance.defaultFeaturePath, "category", categoryTabeExtension);
    });
});


