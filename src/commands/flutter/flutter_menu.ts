import path from "path";
import { window } from "vscode";
import { writeToFile } from "../../utils";
import { getLibPath, getRootWorkspaceFolders } from "../../utils/path_util";
import { addBaseTemplate, addFeatureFolders, createTemplateFiles } from "./template_project/flutter_add_template_file";
import { startApp } from "./flutter_content/flutter_content";
import { createFlutterPackage } from "./flutter_create_package";
import { flutterCreateNewProject } from "./template_project/flutter_create_project";
import { createIndexDartFiles } from "./add_barrel_files";
import { addStartPlugins } from "./template_project/add_flutter_plugins";



export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Новый проект': () => flutterCreateNewProject(addBaseTemplate),
        'Добавить base template': () => addBaseTemplate(getRootWorkspaceFolders()),
        'Добавить template files': () => createTemplateFiles(getRootWorkspaceFolders()),
        'Добавить плагины': () => addStartPlugins(getRootWorkspaceFolders()),
        'Добавить feauture': () => addFeatureFolders(getRootWorkspaceFolders()),
        'Обновить barrel': () => createIndexDartFiles(getLibPath()),
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
