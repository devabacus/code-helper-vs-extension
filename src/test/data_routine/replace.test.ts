import assert from "assert";
import { replaceTextInFile } from "../../utils";
import { appDatabaseExampleFileEmpty } from "./file_example/appdatabase_example";


suite('app database', () => {
    test('add table', () => {
        
        const simplestCont = `@DriftDatabase(tables: [])`;
        const simplestRes = `@DriftDatabase(tables: [CategoryTable])`;
        const simplestRes2 = `@DriftDatabase(tables: [CategoryTable, TagTable])`;

        const groupReplacer = (content: string, regex: RegExp, newTableName: string) => content.replace(regex, (match,p1)=>{
            const trimmedCont = p1.trim();
            return `tables: [${trimmedCont? trimmedCont + ', ':''}${newTableName}]`;
        });
        assert.strictEqual(groupReplacer(simplestCont, /tables: \[(.*)\]/g, 'CategoryTable'), simplestRes);
        
        assert.strictEqual(groupReplacer(simplestRes, /tables: \[(.*)\]/g, 'TagTable'), simplestRes2);


        
    });
});
