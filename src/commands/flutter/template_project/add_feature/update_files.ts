import path from 'path';
import { insertAtFileStart, insertTextAfter } from '../../../../utils/text_work/text_insert/basic-insertion';
import { capitalize } from '../../../../utils/text_work/text_util';
import { importFeatureRouter } from '../flutter_content/files_content/files_contents';

import { getCurrentLineText } from '../../../../utils/ui/ui_util';
import { featureNavServicePath } from '../flutter_content/files_content/files_path';
import { featurePageContent } from '../flutter_content/files_content/root_files';
import { appRouterConfigPath, appRouterNavServicePath } from '../flutter_content/template_paths';
import { featureNavServiceMethod, featurePageNameAddConstants, featurePageNameRouterMethod, importFeatureRoutesConst, importPageFeatureRouter, navServiceMethod } from './constants/files_contents';
import { featureRouterConfigPath, featureRoutesConstantPath } from './feature_files_paths';


export function updateAppRouterThings(featureName: string | undefined, rootPath: string) {
    const appRouterFilePath = appRouterConfigPath(rootPath);
    const appNavServiceFilePath = appRouterNavServicePath(rootPath);

    insertAtFileStart(appRouterFilePath, importFeatureRouter(featureName!));
    insertAtFileStart(appNavServiceFilePath, importFeatureRoutesConst(featureName!));

    insertTextAfter(appRouterFilePath, 'routes: [', `\t\t\t...get${capitalize(featureName!)}Routes(),`);
    insertTextAfter(appNavServiceFilePath, 'class NavigationService {', navServiceMethod(featureName!));
}

export async function updateRoutingFiles(filePath: string) {
    
    const featureName = getFeatureName(filePath);
    const pageName = getPageName(filePath);
    const featureRouterCongifFile = featureRouterConfigPath(getFeaturePath(filePath), getFeatureName(filePath));


    insertAtFileStart(filePath, featurePageContent(featureName, pageName));
    
    insertTextAfter(featureNavServicePath(getFeaturePath(filePath), getFeatureName(filePath)), 'NavigationService {', featureNavServiceMethod(featureName, pageName));
    
    insertTextAfter(featureRouterCongifFile, 'return [', featurePageNameRouterMethod(featureName, pageName));
    
    insertTextAfter(featureRoutesConstantPath(getFeaturePath(filePath), getFeatureName(filePath)), 'Routes {', featurePageNameAddConstants(featureName, pageName));
    
    insertAtFileStart(featureRouterCongifFile, importPageFeatureRouter(pageName));
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

export async function getParamsFromConstructor() {
    
    const lineText = getCurrentLineText();
    const regexMatch = lineText!.match(/(\w+)\s?\((.+)\)/)!;
    const pageName = regexMatch[1].split('Page')[0];
    console.log(pageName); 
    // {required this.name, super.key}
    const dirtyParamList = regexMatch[2].split(',');
    const paramList = [];

    const exludeChars = ['.','required','this','key','super','}','{'];

    for (const dirtyParam of dirtyParamList) {
        var param = dirtyParam;
        for (const excl of exludeChars) {
            param = param.replace(excl, '');
        }
        if (param !== '') {
            paramList.push(param.trim());
        }
    }

    console.log(pageName);
    console.log(paramList);
}

