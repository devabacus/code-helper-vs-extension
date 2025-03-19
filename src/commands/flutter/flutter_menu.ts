import path from "path";
import { window } from "vscode";
import { executeCommand, writeToFile } from "../../utils";
import { getActiveEditorPath, getLibPath, getRootWorkspaceFolders } from "../../utils/path_util";
import { createFlutterPackage } from "./flutter_create_package";
import { createIndexDartFiles } from "./template_project/add_barrel_files";
import { addFeatureFolders } from "./template_project/add_feature/add_feature";
import { updateRoutingFiles } from "./template_project/add_feature/update_files";
import { addBaseTemplate, createTemplateFiles } from "./template_project/flutter_add_template_file";
import { mainFile } from "./template_project/flutter_content/files_content/root_files";
import { addStartPlugins } from "./template_project/flutter_content/terminal_commands";
import { flutterCreateNewProject } from "./template_project/flutter_create_project";



export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Новый проект': () => flutterCreateNewProject(addBaseTemplate),
        'Добавить base template': () => addBaseTemplate(getRootWorkspaceFolders()),
        'Добавить template files': () => createTemplateFiles(getRootWorkspaceFolders()),
        'Добавить плагины': () => executeCommand(addStartPlugins, getRootWorkspaceFolders()),
        'Добавить feauture': () => addFeatureFolders(getRootWorkspaceFolders()),
        'Обновить barrel': () => createIndexDartFiles(getLibPath()),
        'Новый базовый проект': () => flutterCreateNewProject(startAppRoutine),
        'Создать Flutter пакет': createFlutterPackage,
        'Создать навигацию для файла': () => updateRoutingFiles(getActiveEditorPath()!),
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
    writeToFile(path.join(fullProjectPath, "lib", "main.dart"), mainFile);
}
