import { createFile, createFolder } from "../../../utils";
import { dataProvCont, dataProvPath } from "./files/providers/data_layer_prov";
import { presentProvFoldPath, presentProvPath, presentStateProvCont } from "./files/providers/present_state_prov";
import { usecaseProvCont, useCaseProvPath } from "./files/providers/use_case_prov";


export async function addProviderFiles(featurePath: string, driftClassName: string) {

    const newTableFolderP = presentProvFoldPath(featurePath, driftClassName);
    await createFolder(newTableFolderP);
    const _presentProvPath = presentProvPath(newTableFolderP, driftClassName);
    const _presentStateProvCont = presentStateProvCont(driftClassName);
    await createFile(_presentProvPath, _presentStateProvCont);

    const _dataProvPath = dataProvPath(featurePath, driftClassName);
    const _dataProvCont = dataProvCont(driftClassName);
    await createFile(_dataProvPath, _dataProvCont);

    const _useCaseProvPath = useCaseProvPath(featurePath, driftClassName);
    const _usecaseProvCont = usecaseProvCont(driftClassName);
    await createFile(_useCaseProvPath, _usecaseProvCont);

}


