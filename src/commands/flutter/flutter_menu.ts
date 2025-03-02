import { window } from "vscode";
import { createFlutterPackage } from "./flutter_create_package";
import { addBLePackage } from "./add_ble_package";
import { startFlutterApp, startFlutterAppRouter } from "./start_flutter_app";
import { flutterCreateNewProject } from "./flutter_create_project";
import { addRouterToProject } from "./add_flutter_plugins";
import { addFileFromSnippetFolder, writeToFile } from "../../utils";
import path from "path";
import { startApp, startAppWithRoute } from "./flutter_content/flutter_content";
import { getRootWorkspaceFolders } from "../../utils/path_util";




export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Новый проект': () => flutterCreateNewProject(startAppRoutine),
        'Новый проект c роутером': () => flutterCreateNewProject(addRouterToProject),
        'Создать Flutter пакет': createFlutterPackage,
        'Добавить ble': addBLePackage,
        'Старт': startFlutterApp,
        'Старт c router': startFlutterAppRouter,
        'Добавить flutter_handler.ps1': () => addFileFromSnippetFolder("flutter_handle.ps1", getRootWorkspaceFolders()),
        'Добавить git_handle.ps1': () => addFileFromSnippetFolder("git_handle.ps1", getRootWorkspaceFolders()),
        // 'Добавить feature' : 
    };

    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}


export function startAppRoutine(fullProjectPath: string) {
    writeToFile(path.join(fullProjectPath, "lib", "main.dart"), startApp);
}
