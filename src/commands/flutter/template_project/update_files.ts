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

    const p  = new PathData(filePath).data;
    const clsParams: ClsParams[] = parseClsParams(getDocText());
    updateFFiles(p.featurePath, p.featName, p.pageName, clsParams);

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



