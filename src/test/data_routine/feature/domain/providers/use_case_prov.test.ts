import assert from "assert";
import { usecaseProvCont } from "../../../../../commands/flutter/data_routine/feature/domain/providers/use_case_prov";
import { useCaseCategoryProviderExample, useCaseTagProviderExample } from "./use_case_prov_example";



suite('use cases', () => {

        const driftClassNameCategory = 'category';
        const driftClassNameTag = 'tag';

        test('usecase/providers category', () => {
            assert.strictEqual(usecaseProvCont(driftClassNameCategory), useCaseCategoryProviderExample);
        });
    
        test('usecase/providers tag', () => {
            assert.strictEqual(usecaseProvCont(driftClassNameTag), useCaseTagProviderExample);
        });
});


