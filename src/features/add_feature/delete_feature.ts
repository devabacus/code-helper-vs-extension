import * as fs from 'fs';
import { isFileContains, replaceTextInFile } from "../../utils";
import { cap } from "../../utils/text_work/text_util";
import { confirmDialog } from "../../utils/ui/ui_util";
import { routerNavServPath, routerPath } from "../template_project/flutter_content/template_paths";
import { PathData } from '../utils/path_util';

export async function deleteFuture(filePath: string): Promise<void> {
  if (!await confirmDialog('удалить фичу?', 'да', 'нет')) { return; }

  const p = new PathData(filePath).data;
  const navServPath = routerNavServPath(p.rootPath);
  const _routerPath = routerPath(p.rootPath);

  if (isFileContains(_routerPath, `${cap(p.featName)}Routes`)) {
    replaceTextInFile(_routerPath, /initialLocation:.*/, `initialLocation: HomeRoutes.homePath,`);
  }
  const imRegex = new RegExp(`import.*${p.featName}_routes_constants.*`);
  const imRegex_conf = new RegExp(`import.*${p.featName}_router_config.*`);

  replaceTextInFile(navServPath, navMethod(p.featName), '');
  replaceTextInFile(navServPath, imRegex, '');
  replaceTextInFile(_routerPath, imRegex, '');
  replaceTextInFile(_routerPath, imRegex_conf, '');
  replaceTextInFile(_routerPath, `...get${cap(p.featName)}Routes(),`, '');

  fs.rmSync(p.featurePath, { recursive: true, force: true });

}

export const navMethod = (fName: string) => {
  const cFName = cap(fName);

  return `
    void navigateTo${cFName}(BuildContext context) {
      context.goNamed(${cFName}Routes.${fName});
    }
`;
};

