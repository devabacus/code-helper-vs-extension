import assert from "assert";
import { sum } from "../../utils/calc_handle";




suite('Extension Test Suite', () => {
    test('Sample test', () => {
        assert.strictEqual(sum(3,4),8);
        assert.strictEqual(sum(5,5),10);
        assert.strictEqual(sum(15,5),20);
    });
});



    