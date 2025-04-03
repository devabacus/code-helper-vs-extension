import assert from "assert";
import { daoLocalContent } from "../../commands/flutter/data_routine/files/data_local_dao_dart";
import { dataModelPath } from "../../commands/flutter/data_routine/files/data_model_dart";
import { daoClassExample } from "./file_example/dao_class_example";
import { useCaseCreateFileExample } from "./file_example/use_cases/use_case_create";
import { useCaseCreateCont } from "../../commands/flutter/data_routine/files/usecases/use_case_create";
import { localSourceFileExample } from "./file_example/local_source_example";
import { localDataSourceCont } from "../../commands/flutter/data_routine/files/local_data_source_dart";
import { DriftClassParser } from "../../commands/flutter/data_routine/drift_class_parser";
import { tableCategory } from "./file_example/drift_class_examples";
import { useCaseDeleteExample } from "./file_example/use_cases/use_case_delete";
import { useCaseDeleteCont } from "../../commands/flutter/data_routine/files/usecases/use_case_delete";
import { useCaseUpdateExample } from "./file_example/use_cases/use_case_update";
import { useCaseUpdateCont } from "../../commands/flutter/data_routine/files/usecases/use_case_update";
import { useCaseGetByIdExample } from "./file_example/use_cases/use_case_get_by_id";
import { useCaseGetByIdCont } from "../../commands/flutter/data_routine/files/usecases/use_case_get_by_id";
import { useCaseGetAllCont } from "../../commands/flutter/data_routine/files/usecases/use_case_get_all";
import { useCaseGetAllExample } from "./file_example/use_cases/use_case_get_all";
import { dataLayerProviderExample } from "./file_example/providers/data_layer_prov_example";
import { useCaseCategoryProviderExample } from "./file_example/providers/use_case_prov_example";
import { presentStateProvExample } from "./file_example/providers/present_state_prov_example";
import { dataProvCont } from "../../commands/flutter/data_routine/files/providers/data_layer_prov";
import { usecaseProvCont } from "../../commands/flutter/data_routine/files/providers/use_case_prov";
import { presentStateProvCont } from "../../commands/flutter/data_routine/files/providers/present_state_prov";

suite('file generate test', () => {

    const driftClassCategory = new DriftClassParser(tableCategory);


    test('dao test', () => {
        assert.strictEqual(daoClassExample, daoLocalContent("category"));

    });

    test('local store file generate', () => {
        assert.strictEqual(localSourceFileExample, localDataSourceCont(driftClassCategory));

    });

});


suite('use cases', () => {

    test('create', () => {
        assert.strictEqual(useCaseCreateFileExample, useCaseCreateCont('category'));

    });

    test('delete', () => {
        assert.strictEqual(useCaseDeleteExample, useCaseDeleteCont('category'));

    });

    test('update', () => {
        assert.strictEqual(useCaseUpdateExample, useCaseUpdateCont('category'));

    });

    test('getById', () => {
        assert.strictEqual(useCaseGetByIdExample, useCaseGetByIdCont('category'));

    });

    test('getAll', () => {
        assert.strictEqual(useCaseGetAllExample, useCaseGetAllCont('category'));

    });

});











