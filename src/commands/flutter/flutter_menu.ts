import { window } from "vscode";
import { createFlutterPackage } from "./flutter_create_package";
import { addBLePackage } from "./add_ble_package";
import { startFlutterApp, startFlutterAppRouter } from "./start_flutter_app";
import { flutterCreateNewProject } from "./flutter_create_project";
import { addRouterToProject } from "./add_flutter_plugins";
import { addFileFromSnippetFolder, executeCommand, writeToFile } from "../../utils";
import path from "path";
import { startApp, startAppWithRoute } from "./flutter_content/flutter_content";
import { getRootWorkspaceFolders } from "../../utils/path_util";
import * as fs from "fs";
import { mLogger } from "./flutter_content/package_pubscpec";





export async function addDependecy(newDependency: string, projectPath: string):Promise<void> {
    
    const pubspecFilePath = path.join(projectPath, "pubspec.yaml");
    const content = fs.readFileSync(pubspecFilePath, { encoding: "utf-8" });        
    const newContent = content.replace('dependencies:', `dependencies:\n${newDependency}`);
    fs.writeFileSync(pubspecFilePath, newContent, { encoding: "utf-8" });
    await executeCommand('flutter pub get', projectPath);
    // console.log(content);
}


export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Новый базовый проект': () => flutterCreateNewProject(startAppRoutine),
        'Новый проект с роутером, логгером': () => flutterCreateNewProject(addRouterToProject),
        'Создать Flutter пакет': createFlutterPackage,
        'Добавить ble': addBLePackage,
        'Добавить logger': ()=>addDependecy(mLogger, getRootWorkspaceFolders()),
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


// функция для создания простого приложения в main.dart
export function startAppRoutine(fullProjectPath: string) {
    writeToFile(path.join(fullProjectPath, "lib", "main.dart"), startApp);
}
