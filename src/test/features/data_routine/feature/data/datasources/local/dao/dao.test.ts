import assert from "assert";
import { daoClassExample } from "../sources/dao_class_example";
import { daoLocalContent } from "../../../../../../../../features/data_routine/feature/data/datasources/local/dao/data_local_dao_dart";



    test('dao test', () => {
        assert.strictEqual(daoClassExample, daoLocalContent("category"));

    });
