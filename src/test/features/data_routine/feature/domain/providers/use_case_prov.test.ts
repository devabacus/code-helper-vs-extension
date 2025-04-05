import assert from "assert";
import { useCaseCategoryProviderExample, useCaseTagProviderExample } from "./use_case_prov_example";
// import { usecaseProvCont } from "../../../../../../features/data_routine/feature/domain/providers/domain_prov_generator";



suite('use cases', () => {

        const driftClassNameCategory = 'category';
        const driftClassNameTag = 'tag';

        test('domain/providers usecases category', () => {
            // assert.strictEqual(usecaseProvCont(driftClassNameCategory), useCaseCategoryProviderExample);
        });
    
        test('domain/providers usecases tag', () => {
            // assert.strictEqual(usecaseProvCont(driftClassNameTag), useCaseTagProviderExample);
        });
});


