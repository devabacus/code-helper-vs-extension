import { insAtFlStart, insertTextAfter } from "@utils";

import { PathData } from '../../flutter_utils/path_util';
import { ClsParams, parseClsParams } from '../../flutter_utils/text_utils';
import { } from '../add_feature/feat_folds_path';
import { fNavServ, fNavServPath, fRouterPath, fRouterPm, fRoutesConstPth, imPageFRouter, } from '../add_feature/files';
import { fAddConst } from '../add_feature/files/feat_routes_const';
import { navServiceMethod } from '../add_feature/files/nav_service';
import { appRouterAdd, imFRouter, imFRoutesConst } from '../add_feature/files/router_config';
import { routerNavServPath, routerPath } from './flutter_content/template_paths';
import { getDocText } from "@ui";


export function updRouterThings(featureName: string | undefined, rootPath: string) {
    const appRouterFilePath = routerPath(rootPath);
    const navServFlPath = routerNavServPath(rootPath);

    insAtFlStart(appRouterFilePath, imFRouter(featureName!));
    insAtFlStart(navServFlPath, imFRoutesConst(featureName!));

    insertTextAfter(appRouterFilePath, 'routes: [', appRouterAdd(featureName!));
    insertTextAfter(navServFlPath, 'class NavigationService {', navServiceMethod(featureName!));
}

export async function updateRoutingFls(filePath: string) {

    const clsParams: ClsParams[] = parseClsParams(getDocText());
    updateFFiles(filePath, clsParams);

}

export function updateFFiles(filePath: string, fields: ClsParams[] = []) {

    const pathData = new PathData(filePath);

    const p = pathData.data;

    const names = fields.map((field) => field.name);
    const fRouterFile = fRouterPath(p.featurePath, p.featName);

    // [featureName]_navigation_servece.dart
    insertTextAfter(fNavServPath(p.featurePath, p.featName), 'NavigationService {', fNavServ(p.featName, p.unCapPageName, fields));

    // [featureName]_router_config.dart
    insertTextAfter(fRouterFile, 'return [', fRouterPm(p.featName, p.unCapPageName, names));

    // [featureName]_router_constants.dart
    insertTextAfter(fRoutesConstPth(p.featurePath, p.featName), 'Routes {', fAddConst(pathData, convertParams(names)));
    //import
    insAtFlStart(fRouterFile, imPageFRouter(p.pageName));
}

function convertParams(params: string[]): string {
    let paramsStr = '';
    if (params.length > 0) {
        const paramsList = (params.map((param) => `/:${param}`));
        paramsStr = paramsList.join('');
    }
    return paramsStr;
}



