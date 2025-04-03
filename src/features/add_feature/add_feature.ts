
import { createFile, createFolders } from '../../utils';
import { getUserInputWrapper } from '../../utils/ui/ui_ask_folder';

import { fNavServBase, fNavServPath, fNavServProv, fNavServProvPath, fNavServProvGen, fNavServProvGenPth, fRouterPath, routerFFlCont, fRoutesConstPth, fRoutesConsts } from '../add_feature/files';


import { updRouterThings } from '../template_project/update_files';
import { fFoldPths } from './feat_folds_path';
import { fMainPgCont, fMainPgPth } from './files/feat_main_page_cont';


export async function addFeatureFolders(rootPath: string, featName: string = "") {

    let featureName = featName;

    if (featName === '') {
        featureName = await getUserInputWrapper(true, "type feature name") as string;
    }
    const feauturePath = `${rootPath}/lib/features/${featureName}`;
    if (featureName === 'undefined') { return; }

    const featureFolders = fFoldPths.map(function (pathTempDirFiles) {
        return `${feauturePath}/${pathTempDirFiles}`;
    });

    await createFolders(featureFolders);
    await createTemplFContFls(feauturePath, featureName);

    // crBarrelFls(`${feauturePath}`);
    updRouterThings(featureName, rootPath);
}

export async function createTemplFContFls(fPth: string, fNm: string) {
    // TODO вынести в отдельный метод
    const fConstFile = fRoutesConstPth(fPth, fNm!);
    const fRoutesCont = fRoutesConsts(fNm!);
    await createFile(fConstFile, fRoutesCont);

    const fConfigFl = fRouterPath(fPth, fNm!);
    const fRouterCont = routerFFlCont(fNm!);
    await createFile(fConfigFl, fRouterCont);

    const fMainPgFl = fMainPgPth(fPth, fNm!);
    const fMainPg = fMainPgCont(fNm!);
    await createFile(fMainPgFl, fMainPg);

    const fNavServFl = fNavServPath(fPth, fNm!);
    const fNavServCont = fNavServBase(fNm!);
    await createFile(fNavServFl, fNavServCont!);

    const fNavServProvFl = fNavServProvPath(fPth, fNm!);
    const fNavServProvCont = fNavServProv(fNm!);
    await createFile(fNavServProvFl, fNavServProvCont!);

    const fNavServProvGenFl = fNavServProvGenPth(fPth, fNm!);
    const fNavServProvGenCont = fNavServProvGen(fNm!);
    await createFile(fNavServProvGenFl, fNavServProvGenCont!);

}




