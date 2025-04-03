import assert from "assert";
import { presentStateProvCont } from "../../../../../commands/flutter/data_routine/feature/presentation/providers/present_state_prov";
import { driftClassNameCategory } from "../../../constants/drift_class_names";
import { presentStateProvExample } from "./present_state_prov_example";




test('present/state_providers', () => {
    assert.strictEqual(presentStateProvCont(driftClassNameCategory), presentStateProvExample);
});

