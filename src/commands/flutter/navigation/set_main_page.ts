import fs from "fs";
import path from "path";
import { getPageName } from "../template_project/update_files";
import { insAtFlStart } from "../../../utils/text_work/text_insert/basic-insertion";
import { routerPath } from "../template_project/flutter_content";
import { imFRoutesConst } from "../add_feature/files/router_config";
import { cap } from "../../../utils/text_work/text_util";



export async function setMainPage(pagePath: string): Promise<void> {

    // G:\Projects\Flutter\a23\lib\features\auth\presentation\pages\auth_page.dart
    const featureName = pagePath.split('features')[1].split('\\')[1];
    const rootPath = pagePath.split('lib')[0];
    const pageName = getPageName(pagePath);
    // const pageName = pageFile.split['_'][0]
    console.log(pageName);
    const route_const = `initialLocation: ${cap(featureName)}Routes.${pageName}Path,`;

    // HomeRoutes.homePath,
    const appRouterFilePath = routerPath(rootPath);

    // добавляем импорт если нет
    if (!isFileContains(appRouterFilePath, imFRoutesConst(featureName!))) {
        insAtFlStart(appRouterFilePath, imFRoutesConst(featureName!));
    }
    replaceTextInFile(appRouterFilePath, /initialLocation:.*/, route_const);
}


export function replaceTextInFile(filePath: string, oldText: string | RegExp, newText: string) {
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });
    const newContent = content.replace(oldText, newText);
    fs.writeFileSync(filePath, newContent, { encoding: "utf-8" });
}

export function isFileContains(filePath: string, mtext: string): boolean {
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });
    if (content.includes(mtext)) {return true;}
    return false;
}

