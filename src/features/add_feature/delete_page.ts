import * as fs from 'fs';
import { isFileContains, replaceTextInFile } from "@utils";
import { confirmDialog } from "@ui";
import { PathData } from "@flutter_utils";
import { fNavServPath, fRouterPath, fRoutesConstPth } from "./files";
import { routerPath } from '../template_project/flutter_content/template_paths';


export async function deletePage(filePath: string): Promise<void> {
    if (!await confirmDialog('удалить страницу', 'да', 'нет')) {
        return;
    }
    const p = new PathData(filePath).data;
    if (!p.isPage) {
        return;
    }

    const fRouterFile = fRouterPath(p.featurePath, p.featName);
    const routerConst = fRoutesConstPth(p.featurePath, p.featName);
    const navServ = fNavServPath(p.featurePath, p.featName);
    const regexImport = new RegExp(`.*${p.pageName}_page.*`);
    const regexMethod = new RegExp(`[\\s\\n]*GoRoute.*[\\s\\S]*.*${p.pageName}.*[\\s\\S]*?\\)[.\\s\\S]*?\\),\[\s\S]*?`, 'g');


    const regexConst = new RegExp(`.*${p.pageName}.*`, 'g');

    const regexNavServ = new RegExp(`\\s*.*${p.capPageName}.*\\{[\\s\\S]*?\\}`, 'g');
    const _routerPath = routerPath(p.rootPath);

    if (isFileContains(_routerPath, `${p.pageName}Path`)) {
        replaceTextInFile(_routerPath, /initialLocation:.*/, `initialLocation: HomeRoutes.homePath,`);
    }
    replaceTextInFile(fRouterFile, regexImport, '');
    replaceTextInFile(fRouterFile, regexMethod, '');
    replaceTextInFile(routerConst, regexConst, '');

    replaceTextInFile(navServ, regexNavServ, '');

    fs.rmSync(filePath);
}
