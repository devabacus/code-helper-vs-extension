import fs from "fs";
import { insAtFlStart } from "../../../utils/text_work/text_insert/basic-insertion";
import { cap } from "../../../utils/text_work/text_util";
import { fRoutesConstPth } from "../add_feature/files";
import { imFRoutesConst } from "../add_feature/files/router_config";
import { routerPath } from "../template_project/flutter_content";
import { getPageName, updateRoutingFls } from "../template_project/update_files";
import { isFileContains, replaceTextInFile } from "../../../utils";



export async function setMainPage(pagePath: string): Promise<void> {

    // G:\Projects\Flutter\a23\lib\features\auth\presentation\pages\auth_page.dart
    const featureName = pagePath.split('features')[1].split('\\')[1];
    const rootPath = pagePath.split('lib')[0];
    const pageName = getPageName(pagePath);
    // const pageName = pageFile.split['_'][0]
    const featureFolderPath = pagePath.split('presentation')[0];

    const fRoutesConstPath = fRoutesConstPth(featureFolderPath, featureName);
    if(!isFileContains(fRoutesConstPath, pageName)){
        updateRoutingFls(pagePath);
    }



    console.log(pageName);
    const route_const = `initialLocation: ${cap(featureName)}Routes.${pageName}Path,`;
    // if(!isFileContains(fRoutesConstPth))
    // HomeRoutes.homePath,
    const appRouterFilePath = routerPath(rootPath);

    // добавляем импорт если нет
    if (!isFileContains(appRouterFilePath, imFRoutesConst(featureName!))) {
        insAtFlStart(appRouterFilePath, imFRoutesConst(featureName!));
    }
    replaceTextInFile(appRouterFilePath, /initialLocation:.*/, route_const);
}



