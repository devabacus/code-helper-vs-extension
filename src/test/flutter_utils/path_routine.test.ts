import assert from "assert";
import path from "path";


suite('path', () => {
    test('директория до файла', () => {


const pathOriginal = "g:\\Projects\\Flutter\\data_routing3\\lib\\features\\home\\domain\\usecases\\category\\create.dart";
const pathExpected = "g:\\Projects\\Flutter\\data_routing3\\lib\\features\\home\\domain\\usecases\\category";

        const getPathToFile = (filePath: string):string => path.dirname(pathOriginal);
        console.log("ivan");
        
        assert.strictEqual(pathExpected, getPathToFile(pathOriginal));

    });
});


