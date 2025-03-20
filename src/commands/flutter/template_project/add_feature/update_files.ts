import path from 'path';
import { insAtFlStart, insertTextAfter } from '../../../../utils/text_work/text_insert/basic-insertion';
import { importFeatureRouter } from '../flutter_content/files_content/files_contents';

import { getConstrData } from '../../utils/text_utils';
import { fNavServ, fNavServPath } from '../navigation_files/feat_nav_service';
import { fRouterPath, fRouterPm, imPageFRouter } from '../navigation_files/feat_router_config';
import { fAddConst, fRoutesConstPath } from '../navigation_files/feat_routes_const';
import { navServiceMethod } from '../navigation_files/nav_service';
import { appRouterAdd, imFRoutesConst } from '../navigation_files/router_config';
import { } from '../flutter_content/files_content/files_path';
import { featurePageContent } from '../flutter_content/files_content/root_files';
import { routerPath, routerNavServPath } from '../flutter_content/template_paths';
import { } from './feature_files_paths';


export function updRouterThings(featureName: string | undefined, rootPath: string) {
    const appRouterFilePath = routerPath(rootPath);
    const navServFlPath = routerNavServPath(rootPath);

    insAtFlStart(appRouterFilePath, importFeatureRouter(featureName!));
    insAtFlStart(navServFlPath, imFRoutesConst(featureName!));

    insertTextAfter(appRouterFilePath, 'routes: [', appRouterAdd(featureName!));
    insertTextAfter(navServFlPath, 'class NavigationService {', navServiceMethod(featureName!));
}

export async function updRoutingFls(filePath: string) {

    //  filePath = G:\Projects\Flutter\a15\lib\features\home\presentation\pages\auth_page.dart    
    const featurePath = getFeaturePath(filePath);
    const featureName = getFeatureName(filePath);
    let pageName = getPageName(filePath);

    // insAtFlStart(filePath, featurePageContent(featureName, pageName));

    const constrData: Record<string, any> = getConstrData();
    pageName = constrData.pageName;
    const params = constrData.params;


    updateFFiles(featurePath, featureName, pageName, params);

}


export function updateFFiles(fPath: string, fName: string, pName: string, pms: string[] = []) {

    const fRouterFile = fRouterPath(fPath, fName);

    insertTextAfter(fNavServPath(fPath, fName), 'NavigationService {', fNavServ(fName, pName, pms));

    insertTextAfter(fRouterFile, 'return [', fRouterPm(fName, pName, pms));

    insertTextAfter(fRoutesConstPath(fPath, fName), 'Routes {', fAddConst(fName, pName, convertParams(pms)));

    insAtFlStart(fRouterFile, imPageFRouter(pName));
}

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



