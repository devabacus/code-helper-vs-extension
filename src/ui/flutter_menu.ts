import path from "path";
import { window } from "vscode";
import { addApiService } from "../features/add_api_service/add_api_service";
import { addFeatureFolders } from "../features/add_feature/add_feature";
import { deleteFuture } from "../features/add_feature/delete_feature";
import { deletePage } from "../features/add_feature/delete_page";
import { setMainPage } from "../features/template_project/set_main_page";
import { addBaseTemplate, createTemplateFiles } from "../features/template_project/flutter_add_template_file";
import { mainFile } from "../features/template_project/flutter_content/files_content/main_file";
import { addStartPlugins } from "../features/template_project/flutter_content/terminal_commands";
import { flutterCreateNewProject } from "../features/template_project/flutter_create_project";
import { updateRoutingFls } from "../features/template_project/update_files";
import { crBarrelFls } from "../features/template_project/add_barrel_files";
import { createDataFiles } from "../features/data_routine/create_data_files";
import { executeCommand, writeToFile } from "../utils";
import { createFlutterPackage } from "../features/flutter_create_package";
import { getActiveEditorPath, getLibPath, getRootWorkspaceFolders } from "../utils/path_util";



export async function flutterHandler() {
    const options: { [key: string]: () => Promise<any> } = {
        'Новый проект': () => flutterCreateNewProject(addBaseTemplate),
        'Добавить base template': () => addBaseTemplate(getRootWorkspaceFolders()),
        'Добавить template files': () => createTemplateFiles(getRootWorkspaceFolders()),
        'Добавить плагины': () => executeCommand(addStartPlugins, getRootWorkspaceFolders()),
        'Добавить feauture': () => addFeatureFolders(getRootWorkspaceFolders()),
        'Новый базовый проект': () => flutterCreateNewProject(startAppRoutine),
        'Создать Flutter пакет': createFlutterPackage,
        'Создать навигацию для файла': () => updateRoutingFls(getActiveEditorPath()!),
        'Добавить api сервис в текущий файл': () => addApiService(getActiveEditorPath()!),
        'сделать главной': () => setMainPage(getActiveEditorPath()!),
        'удалить feature': () => deleteFuture(getActiveEditorPath()!),
        'удалить страницу': () => deletePage(getActiveEditorPath()!),
        'Обновить barrel': () => crBarrelFls(getLibPath()),
        'Создать файлы данных': () => createDataFiles(),

        // 'Создать навигацию по конструктору': () => getConstructorData(),
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
