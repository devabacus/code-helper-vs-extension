
import { createFile, createFolders } from '../../../../utils';
import { getUserInputWrapper } from '../../../../utils/ui/ui_ask_folder';
import { createIndexDartFiles } from '../add_barrel_files';
import { featureMainPagePath } from '../files_for_updates/feat_main_page';
import { featureNavService, fNavServPath } from '../files_for_updates/feat_nav_service';
import { featureNavServiceProvider } from '../files_for_updates/feat_nav_service_prov';
import { featureNavServiceProviderGen } from '../files_for_updates/feat_nav_service_prov_gen';
import { fRouterPath } from '../files_for_updates/feat_router_config';
import { fRoutesConstPath } from '../files_for_updates/feat_routes_const';
import { featureRoutesConstants, routerFeatureFileContent } from '../flutter_content/files_content/files_contents';
import { featureFolderPaths, featureNavServiceProviderGenPath, featureNavServiceProviderPath } from '../flutter_content/files_content/files_path';

import { featureMainPageContent } from '../flutter_content/files_content/root_files';
import { updRouterThings } from './update_files';


export async function addFeatureFolders(rootPath: string, featureNameP: string = "") {

    let featureName = featureNameP;

    if (featureNameP === '') {
        featureName = await getUserInputWrapper(true, "type feature name") as string;
    }


    const feauturePath = `${rootPath}/lib/features/${featureName}`;
    if (featureName === 'undefined') { return; }

    const featureFolders = featureFolderPaths.map(function (pathTempDirFiles) {
        return `${feauturePath}/${pathTempDirFiles}`;
    });

    await createFolders(featureFolders);
    await createTemplFeatureContentFiles(feauturePath, featureName);

    createIndexDartFiles(`${feauturePath}`);

    updRouterThings(featureName, rootPath);

}

export async function createTemplFeatureContentFiles(featurePath: string, featureName: string) {
    const featureConstantsFile = fRoutesConstPath(featurePath, featureName!);
    const featureRoutesContent = featureRoutesConstants(featureName!);
    await createFile(featureConstantsFile, featureRoutesContent);

    const featureConfigFile = fRouterPath(featurePath, featureName!);
    const featureRouterContent = routerFeatureFileContent(featureName!);
    await createFile(featureConfigFile, featureRouterContent);

    const featureMainPageFile = featureMainPagePath(featurePath, featureName!);
    const featureMainPage = featureMainPageContent(featureName!);
    await createFile(featureMainPageFile, featureMainPage);

    const featureNavServiceFile = fNavServPath(featurePath, featureName!);
    const featureNavServiceContent = featureNavService(featureName!);
    await createFile(featureNavServiceFile, featureNavServiceContent!);

    const featureNavServiceProviderFile = featureNavServiceProviderPath(featurePath, featureName!);
    const featureNavServiceProviderContent = featureNavServiceProvider(featureName!);
    await createFile(featureNavServiceProviderFile, featureNavServiceProviderContent!);

    const featureNavServiceProviderGenFile = featureNavServiceProviderGenPath(featurePath, featureName!);
    const featureNavServiceProviderGenContent = featureNavServiceProviderGen(featureName!);
    await createFile(featureNavServiceProviderGenFile, featureNavServiceProviderGenContent!);

}




