import { insAtFlStart, insertTextAfter } from '../../../utils/text_work/text_insert/basic-insertion';
import { } from '../add_feature/files/constants/nav_service_prov_get';

import { getDocText } from '../../../utils/ui/ui_util';
import { } from '../add_feature/feat_folds_path';
import { fNavServ, fNavServPath, fRouterPath, fRouterPm, fRoutesConstPth, imPageFRouter, } from '../add_feature/files';
import { fAddConst } from '../add_feature/files/feat_routes_const';
import { navServiceMethod } from '../add_feature/files/nav_service';
import { appRouterAdd, imFRouter, imFRoutesConst } from '../add_feature/files/router_config';
import { PathData } from '../utils/path_util';
import { ClsParams, parseClsParams } from '../utils/text_utils';
import { routerNavServPath, routerPath } from './flutter_content/template_paths';
import { createFile } from '../../../utils';
import { new_page } from './flutter_content/files_content/new_page';


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

    const pathData = new PathData(filePath)
    const p  = pathData.data;

    const names = fields.map((field) => field.name);
    const fRouterFile = fRouterPath(p.featurePath, p.featName);

    // [featureName]_navigation_servece.dart
    insertTextAfter(fNavServPath(p.featurePath, p.featName), 'NavigationService {', fNavServ(p.featName, p.unCapPageName, fields));

    // [featureName]_router_config.dart
    insertTextAfter(fRouterFile, 'return [', fRouterPm(p.featName, p.unCapPageName, names));

    // [featureName]_router_constants.dart
    insertTextAfter(fRoutesConstPth(p.featurePath, p.featName), 'Routes {', fAddConst(pathData,  convertParams(names)));
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



