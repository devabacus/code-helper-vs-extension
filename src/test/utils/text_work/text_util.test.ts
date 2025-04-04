import assert from "assert";
import { pluralConvert } from "../../../utils/text_work/text_util";




suite('test util', () => {
    test('plural converter', () => {
        
        assert.strictEqual(pluralConvert("testClass"), "testClasses");
        assert.strictEqual(pluralConvert("tag"), "tags");
        assert.strictEqual(pluralConvert("category"), "categories");
        
        


    });
});


