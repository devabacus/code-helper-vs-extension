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

    test('fields parse', () => {
        const entity = `final int id;\nfinal String title;`;
        assert.strictEqual(driftClassCategory.fieldsClass, entity);
    });

    test('fields comma', () => {
        assert.strictEqual(driftClassCategory.fiedsComma, 'id,title');
        assert.strictEqual(driftClassTask.fiedsComma, 'id,title,description,age');
    });


    test('required field', () => {
        const req = 'required this.id,\nrequired this.title,'
        assert.strictEqual(driftClassCategory.fieldsReqThis, req);

    });

});

