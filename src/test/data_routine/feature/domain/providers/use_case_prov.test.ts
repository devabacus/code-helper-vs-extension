import assert from "assert";
import { usecaseProvCont } from "../../../../../features/data_routine/feature/domain/providers/use_case_prov";
import { useCaseCategoryProviderExample, useCaseTagProviderExample } from "../../../../features/feature/domain/providers/use_case_prov_example";



suite('use cases', () => {

    const driftClassNameCategory = 'category';
    const driftClassNameTag = 'tag';

    test('domain/providers usecases category', () => {
        assert.strictEqual(usecaseProvCont(driftClassNameCategory), useCaseCategoryProviderExample);
    });

    test('domain/providers usecases tag', () => {
        assert.strictEqual(usecaseProvCont(driftClassNameTag), useCaseTagProviderExample);
    });
});


