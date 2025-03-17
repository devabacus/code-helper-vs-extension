import path from "path";
import { window } from "vscode";
import { writeToFile } from "../../utils";
import { addRouterToProject } from "./add_flutter_plugins";
import { startApp } from "./flutter_content/flutter_content";
import { createFlutterPackage } from "./flutter_create_package";
import { flutterCreateNewProject } from "./flutter_create_project";
import { addPickedFoldersSet } from "../../utils/ui/ui_util";
import { folderOptions } from "./flutter_content/flutter_constants";
import { addBaseTemplate, addFeatureFolders } from "./flutter_add_template_file";
import { getRootWorkspaceFolders } from "../../utils/path_util";



export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Новый проект': () => flutterCreateNewProject(addBaseTemplate),
        'Добавить feauture': ()=>addFeatureFolders(getRootWorkspaceFolders()),        
        'Новый базовый проект': () => flutterCreateNewProject(startAppRoutine),
        'Создать Flutter пакет': createFlutterPackage,        
    };

    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}


// функция для создания простого приложения в main.dart
export function startAppRoutine(fullProjectPath: string) {
    writeToFile(path.join(fullProjectPath, "lib", "main.dart"), startApp);
}
