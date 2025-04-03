import assert from "assert";
import { dataProvCont } from "../../commands/flutter/data_routine/files/providers/data_layer_prov";
import { usecaseProvCont } from "../../commands/flutter/data_routine/files/providers/use_case_prov";
import { presentStateProvCont } from "../../commands/flutter/data_routine/files/providers/present_state_prov";
import { dataLayerProviderExample } from "./file_example/providers/data_layer_prov_example";
import { useCaseCategoryProviderExample, useCaseTagProviderExample } from "./file_example/providers/use_case_prov_example";
import { presentStateProvExample } from "./file_example/providers/present_state_prov_example";


suite('providers', () => {

    const driftClassNameCategory = 'category';
    const driftClassNameTag = 'tag';

    test('data/providers', () => {
        assert.strictEqual(dataProvCont(driftClassNameCategory), dataLayerProviderExample);
    });

    test('usecase/providers category', () => {
        assert.strictEqual(usecaseProvCont(driftClassNameCategory), useCaseCategoryProviderExample);
    });

    test('usecase/providers tag', () => {
        assert.strictEqual(usecaseProvCont(driftClassNameTag), useCaseTagProviderExample);
    });

    test('present/state_providers', () => {
        assert.strictEqual(presentStateProvCont(driftClassNameCategory), presentStateProvExample);
    });


});




