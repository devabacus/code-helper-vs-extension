import assert from "assert";
import { daoClassExample } from "./feature/data/datasources/local/sources/dao_class_example";
import { tableCategory } from "./fixtures/drift_class_examples";
import { localSourceFileExample } from "./fixtures/local_source_example";
import { DriftClassParser } from "../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";

suite('file generate test', () => {

    const driftClassCategory = new DriftClassParser(tableCategory);

    test('dao test', () => {
        // assert.strictEqual(daoClassExample, daoLocalContent("category"));

    });

    test('local store file generate', () => {
        // assert.strictEqual(localSourceFileExample, localDataSourceCont(driftClassCategory));

    });

});





