import assert from "assert";
import { daoClassExample } from "./feature/data/datasources/local/sources/dao_class_example";
import { tableCategory } from "./fixtures/drift_class_examples";
import { localSourceFileExample } from "./fixtures/local_source_example";
import { DriftClassParser } from "../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";
import { daoLocalContent } from "../../../features/data_routine/feature/data/datasources/local/dao/data_local_dao_dart";
import { localDataSourceCont } from "../../../features/data_routine/feature/data/datasources/local/sources/local_data_source_dart";

suite('file generate test', () => {

    const driftClassCategory = new DriftClassParser(tableCategory);


    test('dao test', () => {
        assert.strictEqual(daoClassExample, daoLocalContent("category"));

    });

    test('local store file generate', () => {
        assert.strictEqual(localSourceFileExample, localDataSourceCont(driftClassCategory));

    });

});





