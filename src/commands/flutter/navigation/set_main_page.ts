import fs from "fs";
import { insAtFlStart } from "../../../utils/text_work/text_insert/basic-insertion";
import { cap } from "../../../utils/text_work/text_util";
import { fRoutesConstPth } from "../add_feature/files";
import { imFRoutesConst } from "../add_feature/files/router_config";
import { routerPath } from "../template_project/flutter_content";
import { updateRoutingFls } from "../template_project/update_files";
import { isFileContains, replaceTextInFile } from "../../../utils";
import { PathData } from "../utils/path_util";



export async function setMainPage(pagePath: string): Promise<void> {

    const pathData = new PathData(pagePath);
    const fName = pathData.featureName;
    const rootPath = pathData.rootPath;
    const pageName = pathData.pageName;
    const fPath = pathData.feauturePath;


    const fRoutesConstPath = fRoutesConstPth(fPath, fName);
    if(!isFileContains(fRoutesConstPath, pageName)){
        updateRoutingFls(pagePath);
    }

    console.log(pageName);
    const route_const = `initialLocation: ${cap(fName)}Routes.${pageName}Path,`;
    // if(!isFileContains(fRoutesConstPth))
    // HomeRoutes.homePath,
    const appRouterFilePath = routerPath(rootPath);

    // добавляем импорт если нет
    if (!isFileContains(appRouterFilePath, imFRoutesConst(fName!))) {
        insAtFlStart(appRouterFilePath, imFRoutesConst(fName!));
    }
    replaceTextInFile(appRouterFilePath, /initialLocation:.*/, route_const);
}



