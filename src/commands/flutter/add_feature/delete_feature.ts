import { replaceTextInFile } from "../../../utils";
import { getPathData } from "../../../utils/path_util";
import { cap } from "../../../utils/text_work/text_util";
import { routerNavServPath, routerPath } from "../template_project/flutter_content/template_paths";
import { fNavServPath } from "./files";
import * as fs from 'fs';

export async function deleteFuture(filePath: string): Promise<void> {
    const fData = getPathData(filePath);
    // from navigation_service_dart
    // remove string `import.*{fName}_routes_constants.*`
     const navServPath = routerNavServPath(fData.rootPath);
     const _routerPath = routerPath(fData.rootPath);

    const imRegex = new RegExp(`import.*${fData.featName}_routes_constants.*`);
    const imRegex_conf = new RegExp(`import.*${fData.featName}_router_config.*`);

    replaceTextInFile(navServPath,navMethod(fData.featName),'');
    replaceTextInFile(navServPath,imRegex,'');
    replaceTextInFile(_routerPath,imRegex_conf,'');
    replaceTextInFile(_routerPath,`...get${cap(fData.featName)}Routes(),`,'');
    
    fs.rmSync(fData.featurePath, {recursive: true, force: true});

}


export async function confirmDialog() {
    


// vscode.window.showInformationMessage(
//     'Вы уверены, что хотите выполнить это действие?', // Текст сообщения
//     'Да', 'Нет' // Кнопки для выбора
// ).then((selection) => {
//     // Обрабатываем выбор пользователя
//     if (selection === 'Да') {
//         vscode.window.showInformationMessage('Действие выполнено!');
//     } else if (selection === 'Нет') {
//         vscode.window.showInformationMessage('Действие отменено.');
//     }
// });


}


export const navMethod = (fName: string) => {
    const cFName = cap(fName);
    
return `
    void navigateTo${cFName}(BuildContext context) {
      context.goNamed(${cFName}Routes.${fName});
    }
`;};

