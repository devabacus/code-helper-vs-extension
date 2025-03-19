import path from 'path';
import { insertAtFileStart, insertTextAfter } from '../../../../utils/text_work/text_insert/basic-insertion';
import { capitalize } from '../../../../utils/text_work/text_util';
import { importFeatureRouter } from '../flutter_content/files_content/files_contents';

import { featureNavServicePath } from '../flutter_content/files_content/files_path';
import { featurePageContent } from '../flutter_content/files_content/root_files';
import { appRouterConfigPath, appRouterNavServicePath } from '../flutter_content/template_paths';
import { featureNavServiceMethod, featurePageNameAddConstants, featureRouter, featureRouterParam, importFeatureRoutesConst, importPageFeatureRouter, navServiceMethod } from './constants/files_contents';
import { featureRouterConfigPath, featureRoutesConstantPath } from './feature_files_paths';
import { getConstructorData } from '../../utils/text_utils';


export function updateAppRouterThings(featureName: string | undefined, rootPath: string) {
    const appRouterFilePath = appRouterConfigPath(rootPath);
    const appNavServiceFilePath = appRouterNavServicePath(rootPath);

    insertAtFileStart(appRouterFilePath, importFeatureRouter(featureName!));
    insertAtFileStart(appNavServiceFilePath, importFeatureRoutesConst(featureName!));

    insertTextAfter(appRouterFilePath, 'routes: [', `\t\t\t...get${capitalize(featureName!)}Routes(),`);
    insertTextAfter(appNavServiceFilePath, 'class NavigationService {', navServiceMethod(featureName!));
}

export async function updateRoutingFiles(filePath: string) {

    //  filePath = G:\Projects\Flutter\a15\lib\features\home\presentation\pages\auth_page.dart    
    const featurePath = getFeaturePath(filePath);
    const featureName = getFeatureName(filePath);
    let pageName = getPageName(filePath);

    insertAtFileStart(filePath, featurePageContent(featureName, pageName));

    const constrData: Record<string, any> = getConstructorData();
    pageName = constrData.pageName;
    const params = constrData.params;


    updateFeatureFiles(featurePath, featureName, pageName, params);

}


export function updateFeatureFiles(featurePath: string, featureName: string, pageName: string, params: string[] = []) {

    const featureRouterCongifFile = featureRouterConfigPath(featurePath, featureName);

    insertTextAfter(featureNavServicePath(featurePath, featureName), 'NavigationService {', featureNavServiceMethod(featureName, pageName, params));



    insertTextAfter(featureRouterCongifFile, 'return [', featureRouterParam(featureName, pageName, params));


    insertTextAfter(featureRoutesConstantPath(featurePath, featureName), 'Routes {', featurePageNameAddConstants(featureName, pageName, convertParams(params)));

    insertAtFileStart(featureRouterCongifFile, importPageFeatureRouter(pageName));
}



// final name = state.pathParameters['name'];
// return AuthPage(name: name);


function convertParams(params: string[]): string {
    let paramsStr = '';
    if (params.length > 0) {
        const paramsList = (params.map((param) => `/:${param}`));
        paramsStr = paramsList.join('');
    }
    return paramsStr;
}


export function getFeatureName(pth: string) {
    const filePathList = pth!.split(path.sep);
    const featureNameIdx = filePathList.indexOf('features') + 1;
    return filePathList[featureNameIdx];
}

export function getPageName(pth: string): string {
    const fileName = path.parse(pth!).name;
    return fileName.split('_')[0];
}

export function getFeaturePath(pth: string): string {
    const featureName = getFeatureName(pth);
    return path.join(pth!.split(featureName)[0], featureName);
}



