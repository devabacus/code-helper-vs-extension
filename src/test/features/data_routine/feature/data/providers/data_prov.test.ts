import assert from "assert";
import { driftClassNameCategory } from "../../../constants/drift_class_names";
import { dataProviderExample } from "./data_prov_example";
import { dataProvCont } from "../../../../../../features/data_routine/feature/data/providers/data_layer_prov";




test('data/providers', () => {
    assert.strictEqual(dataProvCont(driftClassNameCategory), dataProviderExample);
});