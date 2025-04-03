import assert from "assert";
import { appDatabaseExampleFileEmpty, appDatabaseExampleFileOneTable, appDatabaseExampleFileTwoTable } from "./core/database/local/appdatabase_example";
import { textGroupReplacer } from "../../../utils/text_work/text_util";


suite('app database', () => {
    test('add table', () => {

        const simplestCont = `@DriftDatabase(tables: [])`;
        const simplestRes = `@DriftDatabase(tables: [CategoryTable])`;
        const simplestRes2 = `@DriftDatabase(tables: [CategoryTable, TagTable])`;

        assert.strictEqual(textGroupReplacer(simplestCont, /tables: \[(.*)\]/g, 'CategoryTable'), simplestRes);
        assert.strictEqual(textGroupReplacer(simplestRes, /tables: \[(.*)\]/g, 'TagTable'), simplestRes2);
      
      
        assert.strictEqual(textGroupReplacer(appDatabaseExampleFileEmpty, /tables: \[(.*)\]/g, 'CategoryTable'), appDatabaseExampleFileOneTable);
        // assert.strictEqual(textGroupReplacer(appDatabaseExampleFileOneTable, /tables: \[(.*)\]/g, 'TagTable'), appDatabaseExampleFileTwoTable);
    });
});
