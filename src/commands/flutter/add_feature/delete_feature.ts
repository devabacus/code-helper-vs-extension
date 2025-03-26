import * as fs from 'fs';
import { isFileContains, replaceTextInFile } from "../../../utils";
import { getPathData } from "../../../utils/path_util";
import { cap } from "../../../utils/text_work/text_util";
import { confirmDialog } from "../../../utils/ui/ui_util";
import { routerNavServPath, routerPath } from "../template_project/flutter_content/template_paths";

export async function deleteFuture(filePath: string): Promise<void> {
    if (!await confirmDialog('удалить фичу?', 'да', 'нет')) { return; }

    const fData = getPathData(filePath);
    // from navigation_service_dart
    // remove string `import.*{fName}_routes_constants.*`
    const navServPath = routerNavServPath(fData.rootPath);
    const _routerPath = routerPath(fData.rootPath);
    
    if(isFileContains(_routerPath, `${cap(fData.featName)}Routes`)){
    replaceTextInFile(_routerPath, /initialLocation:.*/, `initialLocation: HomeRoutes.homePath,`);
    }
    const imRegex = new RegExp(`import.*${fData.featName}_routes_constants.*`);
    const imRegex_conf = new RegExp(`import.*${fData.featName}_router_config.*`);

    replaceTextInFile(navServPath, navMethod(fData.featName), '');
    replaceTextInFile(navServPath, imRegex, '');
    replaceTextInFile(_routerPath, imRegex, '');
    replaceTextInFile(_routerPath, imRegex_conf, '');
    replaceTextInFile(_routerPath, `...get${cap(fData.featName)}Routes(),`, '');

    fs.rmSync(fData.featurePath, { recursive: true, force: true });

}

export const navMethod = (fName: string) => {
    const cFName = cap(fName);

    return `
    void navigateTo${cFName}(BuildContext context) {
      context.goNamed(${cFName}Routes.${fName});
    }
`;
};

