import { isFileContains, replaceTextInFile } from "../../utils";
import { insAtFlStart } from "../../utils/text_work/text_insert/basic-insertion";
import { cap } from "../../utils/text_work/text_util";
import { fRoutesConstPth } from "../add_feature/files";
import { imFRoutesConst } from "../add_feature/files/router_config";
import { routerPath } from "./flutter_content/template_paths";
import { updateRoutingFls } from "./update_files";
import { PathData } from "../utils/path_util";



export async function setMainPage(pagePath: string): Promise<void> {

    const p = new PathData(pagePath).data;

    const fRoutesConstPath = fRoutesConstPth(p.featurePath, p.featName);
    if (!isFileContains(fRoutesConstPath, p.pageName)) {
        updateRoutingFls(pagePath);
    }
    console.log(p.pageName);
    const route_const = `initialLocation: ${cap(p.featName)}Routes.${p.unCapPageName}Path,`;
    const appRouterFilePath = routerPath(p.rootPath);
    // добавляем импорт если нет
    if (!isFileContains(appRouterFilePath, imFRoutesConst(p.featName!))) {
        insAtFlStart(appRouterFilePath, imFRoutesConst(p.featName!));
    }
    replaceTextInFile(appRouterFilePath, /initialLocation:.*/, route_const);
}



