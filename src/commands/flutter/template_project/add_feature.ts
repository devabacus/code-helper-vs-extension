
import { createFile, createFolders } from '../../../utils';
import { getUserInputWrapper } from '../../../utils/ui/ui_ask_folder';
import { createIndexDartFiles } from './add_barrel_files';
import { featureMainPagePath } from './navigation_files/feat_main_page';
import { featureNavService, fNavServPath } from './navigation_files/feat_nav_service';
import { fNavServProv, fNavServProvPath } from './navigation_files/feat_nav_service_prov';
import { fNavServProvGen, fNavServProvGenPth } from './navigation_files/feat_nav_service_prov_gen';
import { fRouterPath, routerFFlCont } from './navigation_files/feat_router_config';
import { fRoutesConstPath, fRoutesConsts } from './navigation_files/feat_routes_const';
import { } from './navigation_files/constants/nav_service_prov_get';
import { fFoldPths } from './flutter_content/files_content/files_path';

import { featureMainPageContent } from './flutter_content/files_content/root_files';
import { updRouterThings } from './update_files';


export async function addFeatureFolders(rootPath: string, featureNameP: string = "") {

    let featureName = featureNameP;

    if (featureNameP === '') {
        featureName = await getUserInputWrapper(true, "type feature name") as string;
    }


    const feauturePath = `${rootPath}/lib/features/${featureName}`;
    if (featureName === 'undefined') { return; }

    const featureFolders = fFoldPths.map(function (pathTempDirFiles) {
        return `${feauturePath}/${pathTempDirFiles}`;
    });

    await createFolders(featureFolders);
    await createTemplFContFls(feauturePath, featureName);

    createIndexDartFiles(`${feauturePath}`);

    updRouterThings(featureName, rootPath);

}

export async function createTemplFContFls(featurePath: string, featureName: string) {
    const fConstFile = fRoutesConstPath(featurePath, featureName!);
    const fRoutesCont = fRoutesConsts(featureName!);
    await createFile(fConstFile, fRoutesCont);

    const fConfigFl = fRouterPath(featurePath, featureName!);
    const fRouterCont = routerFFlCont(featureName!);
    await createFile(fConfigFl, fRouterCont);

    const fMainPgFl = featureMainPagePath(featurePath, featureName!);
    const fMainPg = featureMainPageContent(featureName!);
    await createFile(fMainPgFl, fMainPg);

    const fNavServFl = fNavServPath(featurePath, featureName!);
    const fNavServCont = featureNavService(featureName!);
    await createFile(fNavServFl, fNavServCont!);

    const fNavServProvFl = fNavServProvPath(featurePath, featureName!);
    const fNavServProvCont = fNavServProv(featureName!);
    await createFile(fNavServProvFl, fNavServProvCont!);

    const fNavServProvGenFl = fNavServProvGenPth(featurePath, featureName!);
    const fNavServProvGenCont = fNavServProvGen(featureName!);
    await createFile(fNavServProvGenFl, fNavServProvGenCont!);

}




