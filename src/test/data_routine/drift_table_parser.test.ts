import assert from "assert";
import { DriftClassParser } from "../../commands/flutter/data_routine/drift_class_parser";
import { tableAuth, tableCategory, tableTask } from "./drift_class_examples";


suite('parser drift test', () => {

    const driftClassCategory = new DriftClassParser(tableCategory);

    const driftClassAuth = new DriftClassParser(tableAuth);

    const driftClassTask = new DriftClassParser(tableTask);


    test('get table name', () => {

        assert.strictEqual(driftClassCategory.tableName, "Category");

        assert.strictEqual(driftClassAuth.tableName, "Auth");

        assert.strictEqual(driftClassTask.tableName, "Task");

    });


    test('get fields', () => {
        assert.deepStrictEqual(driftClassCategory.fields, [{name:"id", type: "Int"}, {name:"title", type: "Text"}]);
        
        
        assert.deepStrictEqual(driftClassTask.fields, [
            {name:"id", type: "Int"}, 
            {name:"title", type: "Text"},
            {name:"description", type: "Text"}, 
            {name:"age", type: "In1t"}
        
        ]);

    });

});

