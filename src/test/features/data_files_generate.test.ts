import assert from "assert";
import { daoLocalContent } from "../../features/data_routine/feature/data/datasources/local/dao/data_local_dao_dart";
import { localDataSourceCont } from "../../features/data_routine/feature/data/datasources/local/sources/local_data_source_dart";
import { DriftClassParser } from "../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";
import { tableCategory } from "./file_example/drift_class_examples";
import { localSourceFileExample } from "./file_example/local_source_example";
import { daoClassExample } from "./data_routine/_feature/data/datasources/local/dao/dao_class_example";

suite('file generate test', () => {

    const driftClassCategory = new DriftClassParser(tableCategory);


    test('dao test', () => {
        assert.strictEqual(daoClassExample, daoLocalContent("category"));

    });

    test('local store file generate', () => {
        assert.strictEqual(localSourceFileExample, localDataSourceCont(driftClassCategory));

    });

});





