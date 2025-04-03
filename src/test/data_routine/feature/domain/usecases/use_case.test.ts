import assert from "assert";
import { useCaseCreateFileExample } from "./use_case_create";
import { useCaseDeleteExample } from "./use_case_delete";
import { useCaseUpdateExample } from "./use_case_update";
import { useCaseUpdateCont } from "../../../../../commands/flutter/data_routine/feature/domain/usecases/use_case_update";
import { useCaseGetByIdExample } from "./use_case_get_by_id";
import { useCaseGetByIdCont } from "../../../../../commands/flutter/data_routine/feature/domain/usecases/use_case_get_by_id";
import { useCaseGetAllExample } from "./use_case_get_all";
import { useCaseGetAllCont } from "../../../../../commands/flutter/data_routine/feature/domain/usecases/use_case_get_all";
import { useCaseDeleteCont } from "../../../../../commands/flutter/data_routine/feature/domain/usecases/use_case_delete";
import { useCaseCreateCont } from "../../../../../commands/flutter/data_routine/feature/domain/usecases/use_case_create";




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