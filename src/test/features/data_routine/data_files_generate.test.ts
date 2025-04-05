import assert from "assert";
import { daoClassExample } from "./feature/data/datasources/local/dao/dao_class_example";
import { tableCategory } from "./feature/data/datasources/local/tables/drift_class_examples";
import { localSourceFileExample } from "./feature/data/datasources/local/sources/local_source_example";
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





