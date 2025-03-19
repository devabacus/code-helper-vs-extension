
import { createFile, createFolders } from '../../../../utils';
import { getUserInputWrapper } from '../../../../utils/ui/ui_ask_folder';
import { createIndexDartFiles } from '../add_barrel_files';
import { featureRoutesConstants, routerFeatureFileContent } from '../flutter_content/files_content/files_contents';

import { featureMainPagePath, featureRouterConfigPath, featureRoutesConstantPath } from './feature_files_paths';
import { featureMainPageContent } from '../flutter_content/files_content/root_files';
import { featureNavService, featureNavServiceProvider, featureNavServiceProviderGen } from './constants/files_contents';
import { featureFolderPaths, featureNavServicePath, featureNavServiceProviderGenPath, featureNavServiceProviderPath } from '../flutter_content/files_content/files_path';
import { updateAppRouterThings } from './update_files';


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

    updateAppRouterThings(featureName, rootPath);

}

export async function createTemplFeatureContentFiles(featurePath: string, featureName: string) {
    const featureConstantsFile = featureRoutesConstantPath(featurePath, featureName!);
    const featureRoutesContent = featureRoutesConstants(featureName!);
    await createFile(featureConstantsFile, featureRoutesContent);

    const featureConfigFile = featureRouterConfigPath(featurePath, featureName!);
    const featureRouterContent = routerFeatureFileContent(featureName!);
    await createFile(featureConfigFile, featureRouterContent);

    const featureMainPageFile = featureMainPagePath(featurePath, featureName!);
    const featureMainPage = featureMainPageContent(featureName!);
    await createFile(featureMainPageFile, featureMainPage);

    const featureNavServiceFile = featureNavServicePath(featurePath, featureName!);
    const featureNavServiceContent = featureNavService(featureName!);
    await createFile(featureNavServiceFile, featureNavServiceContent!);

    const featureNavServiceProviderFile = featureNavServiceProviderPath(featurePath, featureName!);
    const featureNavServiceProviderContent = featureNavServiceProvider(featureName!);
    await createFile(featureNavServiceProviderFile, featureNavServiceProviderContent!);

    const featureNavServiceProviderGenFile = featureNavServiceProviderGenPath(featurePath, featureName!);
    const featureNavServiceProviderGenContent = featureNavServiceProviderGen(featureName!);
    await createFile(featureNavServiceProviderGenFile, featureNavServiceProviderGenContent!);

}




