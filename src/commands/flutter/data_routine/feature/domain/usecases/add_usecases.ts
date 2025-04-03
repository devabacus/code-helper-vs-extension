import path from "path";
import { createFile, createFolder } from "../../../../../../utils";
import { useCaseCreateCont, useCaseCreatePath } from "./use_case_create";
import { useCaseDeleteCont, useCaseDeletePath } from "./use_case_delete";
import { useCaseUpdateCont, useCaseUpdatePath } from "./use_case_update";
import { useCaseGetByIdCont, useCaseGetByIdPath } from "./use_case_get_by_id";
import { useCaseGetAllCont, useCaseGetAllPath } from "./use_case_get_all";


export async function addUseCases(featurePath: string, driftClassName: string) {

        const _useCaseCreatePath = useCaseCreatePath(featurePath, driftClassName);
        await createFolder(path.dirname(_useCaseCreatePath));

        const _useCaseCreateCont = useCaseCreateCont(driftClassName);
        await createFile(_useCaseCreatePath, _useCaseCreateCont);

        const _useCaseDeleteCont = useCaseDeleteCont(driftClassName);
        const _useCaseDeletePath = useCaseDeletePath(featurePath, driftClassName);
        await createFile(_useCaseDeletePath, _useCaseDeleteCont);


        const _useCaseUpdateCont = useCaseUpdateCont(driftClassName);
        const _useCaseUpdatePath = useCaseUpdatePath(featurePath, driftClassName);
        await createFile(_useCaseUpdatePath, _useCaseUpdateCont);


        const _useCaseGetByIdCont = useCaseGetByIdCont(driftClassName);
        const _useCaseGetByIdPath = useCaseGetByIdPath(featurePath, driftClassName);
        await createFile(_useCaseGetByIdPath, _useCaseGetByIdCont);

        const _useCaseGetAllCont = useCaseGetAllCont(driftClassName);
        const _useCaseGetAllPath = useCaseGetAllPath(featurePath, driftClassName);
        await createFile(_useCaseGetAllPath, _useCaseGetAllCont);
}
