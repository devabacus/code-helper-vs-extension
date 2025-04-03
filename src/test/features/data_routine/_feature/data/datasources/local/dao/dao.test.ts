import assert from "assert";
import { daoClassExample } from "./dao_class_example";
import { daoLocalContent } from "src/features/data_routine/feature/data/datasources/local/dao/data_local_dao_dart";

test('dao test', () => {
    assert.strictEqual(daoClassExample, daoLocalContent("category"));

});
