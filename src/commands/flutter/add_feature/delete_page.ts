import path from "path";
import { fNavServPath, fRouterPath, fRoutesConstPth } from "./files";
import { isFileContains, replaceTextInFile } from "../../../utils";
import { confirmDialog } from "../../../utils/ui/ui_util";
import { routerPath } from "../template_project/flutter_content";
import { cap } from "../../../utils/text_work/text_util";
import * as fs from 'fs';
import { PathData } from "../utils/path_util";


export async function deletePage(filePath: string): Promise<void> {
    // if(confirmDialog('удалить'))
    const p = new PathData(filePath).data;
    if (!p.isPage) {
        
    }

    const routerFile = fRouterPath(p.featurePath, p.featName);
    const routerConst = fRoutesConstPth(p.featurePath, p.featName);
    const navServ = fNavServPath(p.featurePath, p.featName);
    const regexImport = new RegExp(`.*${p.pageName}_page.*`);
    const regexMethod = new RegExp(`[\\s\\n]*GoRoute.*[\\s\\S]*.*${p.pageName}.*[\\s\\S]*?\\),\\r`, 'g');

    const regexConst = new RegExp(`.*${p.pageName}.*`, 'g');
    
    const regexNavServ = new RegExp(`\\s*.*${p.capPageName}.*\\{[\\s\\S]*?\\}`, 'g');
    const _routerPath = routerPath(p.rootPath);
    
    if(isFileContains(_routerPath, `${p.pageName}Routes`)){
    replaceTextInFile(_routerPath, /initialLocation:.*/, `initialLocation: HomeRoutes.homePath,`);
    }
    replaceTextInFile(routerFile,regexImport,'');
    replaceTextInFile(routerFile,regexMethod,'');
    replaceTextInFile(routerConst,regexConst,'');

    replaceTextInFile(navServ,regexNavServ,'');

    
}
