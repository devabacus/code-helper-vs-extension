import assert from "assert";
import { daoLocalContent } from "../../commands/flutter/data_routine/files/data_local_dao_dart";
import { dataModelPath } from "../../commands/flutter/data_routine/files/data_model_dart";
import { daoClassExample } from "./dao_class_example";

suite('file generate test', () => {
    test('dao test', () => {
        assert.strictEqual(daoLocalContent("category"), daoClassExample);
        
    });
});

