import path from 'path';
import { insAtFlStart, insertTextAfter } from '../../../utils/text_work/text_insert/basic-insertion';
import { } from '../add_feature/files/constants/nav_service_prov_get';

import { ClsParams, getConstrData, getPgName, parseClsParams } from '../utils/text_utils';
import { } from '../add_feature/feat_folds_path';
import { routerNavServPath, routerPath } from './flutter_content/template_paths';
import { fNavServ, fNavServPath, fRouterPath, fRouterPm, imPageFRouter, fRoutesConstPth, } from '../add_feature/files';
import { getDocText } from '../../../utils/ui/ui_util';
import { appRouterAdd, imFRouter, imFRoutesConst } from '../add_feature/files/router_config';
import { navServiceMethod } from '../add_feature/files/nav_service';
import { fAddConst } from '../add_feature/files/feat_routes_const';


export function updRouterThings(featureName: string | undefined, rootPath: string) {
    const appRouterFilePath = routerPath(rootPath);
    const navServFlPath = routerNavServPath(rootPath);

    insAtFlStart(appRouterFilePath, imFRouter(featureName!));
    insAtFlStart(navServFlPath, imFRoutesConst(featureName!));

    insertTextAfter(appRouterFilePath, 'routes: [', appRouterAdd(featureName!));
    insertTextAfter(navServFlPath, 'class NavigationService {', navServiceMethod(featureName!));
}

export async function updateRoutingFls(filePath: string) {

    //  filePath = G:\Projects\Flutter\a15\lib\features\home\presentation\pages\auth_page.dart    
    const featurePath = getFeaturePath(filePath);
    const featureName = getFeatureName(filePath);
    // let pageName = getPageName(filePath);

    // insAtFlStart(filePath, featurePageContent(featureName, pageName));

    // const constrData: Record<string, any> = getConstrData();
    // pageName = constrData.pageName;
    // const params = constrData.params;

    const clsDeclaration = getDocText();
    const pgName = getPgName(clsDeclaration);


    const clsParams: ClsParams[] = parseClsParams(getDocText());

    updateFFiles(featurePath, featureName, pgName, clsParams);

}


export function updateFFiles(fPath: string, fName: string, pName: string, fields: ClsParams[] = []) {
    const names = fields.map((field) => field.name);


    const fRouterFile = fRouterPath(fPath, fName);

    insertTextAfter(fNavServPath(fPath, fName), 'NavigationService {', fNavServ(fName, pName, fields));

    insertTextAfter(fRouterFile, 'return [', fRouterPm(fName, pName, names));

    insertTextAfter(fRoutesConstPth(fPath, fName), 'Routes {', fAddConst(fName, pName, convertParams(names)));

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



