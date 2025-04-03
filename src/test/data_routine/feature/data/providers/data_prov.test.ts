import assert from "assert";
import { dataProvCont } from "../../../../../commands/flutter/data_routine/feature/data/providers/data_layer_prov";
import { driftClassNameCategory } from "../../../constants/drift_class_names";
import { dataProviderExample } from "./data_prov_example";




test('data/providers', () => {
    assert.strictEqual(dataProvCont(driftClassNameCategory), dataProviderExample);
});