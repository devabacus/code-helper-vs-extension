import * as fs from "fs";
import path from "path";
import { window } from "vscode";
import { addFileFromSnippetFolder, executeCommand, writeToFile } from "../../utils";
import { getRootWorkspaceFolders } from "../../utils/path_util";
import { addBLePackage } from "./add_ble_package";
import { addRouterToProject } from "./add_flutter_plugins";
import { startApp } from "./flutter_content/flutter_content";
import { mLogger } from "./flutter_content/package_pubscpec";
import { createFlutterPackage } from "./flutter_create_package";
import { flutterCreateNewProject } from "./flutter_create_project";
import { addDependecy } from "./flutter_add_pubspec";







export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Новый проект': () => flutterCreateNewProject(addRouterToProject),
        'Новый базовый проект': () => flutterCreateNewProject(startAppRoutine),
        'Создать Flutter пакет': createFlutterPackage,
        'Добавить ble': addBLePackage,
        'Добавить logger': ()=>addDependecy(mLogger, getRootWorkspaceFolders()),
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


// функция для создания простого приложения в main.dart
export function startAppRoutine(fullProjectPath: string) {
    writeToFile(path.join(fullProjectPath, "lib", "main.dart"), startApp);
}
