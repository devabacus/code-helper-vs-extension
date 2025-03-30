import path from "path";
import { useCaseCreateCont, useCaseCreatePath } from "./files/usecases/use_case_create";
import { useCaseDeleteCont, useCaseDeletePath } from "./files/usecases/use_case_delete";
import { useCaseGetAllCont, useCaseGetAllPath } from "./files/usecases/use_case_get_all";
import { useCaseGetByIdCont, useCaseGetByIdPath } from "./files/usecases/use_case_get_by_id";
import { useCaseUpdateCont, useCaseUpdatePath } from "./files/usecases/use_case_update";
import { createFile, createFolder } from "../../../utils";


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
