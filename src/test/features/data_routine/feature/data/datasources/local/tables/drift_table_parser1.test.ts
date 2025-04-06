import assert from "assert";
import { tableAuth, tableCategory, tableTask } from "./drift_class_examples";
import { DriftClassParser } from "../../../../../../../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";


suite('parser drift test', () => {

    const driftClassCategory = new DriftClassParser(tableCategory);
    const driftClassAuth = new DriftClassParser(tableAuth);
    const driftClassTask = new DriftClassParser(tableTask);


    test('get table name', () => {

        assert.strictEqual(driftClassCategory.driftClassNameUpper, "Category");
        assert.strictEqual(driftClassAuth.driftClassNameUpper, "Auth");
        assert.strictEqual(driftClassTask.driftClassNameUpper, "Task");

    });

    test('fields parse', () => {
        const entity = `final int id;\nfinal String title;`;
        assert.strictEqual(driftClassCategory.fieldsClass, entity);
    });

    test('fields comma', () => {
        assert.strictEqual(driftClassCategory.fieldsComma, 'id,title');
        assert.strictEqual(driftClassTask.fieldsComma, 'id,title,description,age');
    });


    test('required field', () => {
        const req = 'required this.id,\nrequired this.title,';

        assert.strictEqual(driftClassCategory.fieldsReqThis, req);

    });

    test('param list for local data source', () => {
        const paramRows = `id: category.id, title: category.title`;

        assert.strictEqual(driftClassCategory.paramsInstDrift, paramRows);

    });

    test('param list model', () => {
        const paramRows = `id: model.id, title: model.title`;

        assert.strictEqual(driftClassCategory.paramsInstModel, paramRows);
    });


    test('list without id', () => {
        const paramRows1 = `id: model.id, title: model.title`;

        const paramRows = `title: model.title`;

        assert.strictEqual(driftClassCategory.paramsWithOutId(paramRows1), paramRows);

    });

    test('fields Value wrapper', () => {
        const result = `id: Value(id), title: Value(title)`;
        const result2 = `id: Value(id), title: Value(title), description: Value(description), age: Value(age)`;

        assert.strictEqual(driftClassCategory.paramsWrapValue, result);
        assert.strictEqual(driftClassTask.paramsWrapValue, result2);

    });

});

