import assert from "assert";
import { driftClassNameCategory } from "../../../constants/drift_class_names";
import { presentStateProvExample } from "./present_state_prov_example";
import { presentStateProvCont } from "../../../../../../features/data_routine/feature/presentation/providers/present_state_prov";




test('present/state_providers', () => {
    assert.strictEqual(presentStateProvCont(driftClassNameCategory), presentStateProvExample);
});

