import { window } from "vscode";
import { addApiService } from "../features/add_api_service/add_api_service";
import { addFeatureFolders } from "../features/add_feature/add_feature";
import { deleteFuture } from "../features/add_feature/delete_feature";
import { deletePage } from "../features/add_feature/delete_page";
import { createDataFiles } from "../features/data_routine/create_data_files";
import { createFlutterPackage } from "../features/flutter_create_package";
import { serverpodK8sFileGenerate } from "../features/serverpod/create_k8s_serverpod_files";
import { crBarrelFls } from "../features/template_project/add_barrel_files";
import { addBaseTemplate, createTemplateFiles } from "../features/template_project/flutter_add_template_file";
import { addStartPlugins } from "../features/template_project/flutter_content/terminal_commands";
import { flutterCreateNewServerPodProject } from "../features/template_project/flutter_create_project_serverpod";
import { setMainPage } from "../features/template_project/set_main_page";
import { updateRoutingFls } from "../features/template_project/update_files";
import { executeCommand } from "../utils";
import { getActiveEditorPath, getLibPath, getRootWorkspaceFolders } from "../utils/path_util";
import { createDataFilesFromYaml } from "../features/data_routine/create_data_files_from_yaml";
import { addServerpodMapModel, addServerpodModel } from "../features/data_routine/generators/add_serverpod_model";
import { createDataFilesByReplacement } from "../features/universal_generator/create_data_files_by_replacement";
import { createNewProject } from "../features/universal_generator/create_new_project";


export async function flutterHandler() {
    const options: { [key: string]: () => Promise<any> } = {
        'Создать файлы данных из yaml': () => createDataFilesByReplacement(),
        // 'Создать файлы данных из yaml': () => createDataFilesFromYaml(),
        // 'Новый проект c serverpod': () => flutterCreateNewServerPodProject(addBaseTemplate),
        'Новый проект c serverpod': () => createNewProject(addBaseTemplate),
        'Сгенерировать файлы для serverpod': () => serverpodK8sFileGenerate(getRootWorkspaceFolders()),
        // 'Новый базовый проект': () => flutterCreateNewProject(startAppRoutine),
        'Добавить base template': () => addBaseTemplate(getRootWorkspaceFolders()),
        'Добавить template files': () => createTemplateFiles(getRootWorkspaceFolders()),
        'Добавить плагины': () => executeCommand(addStartPlugins, getRootWorkspaceFolders()),
        'Добавить feauture': () => addFeatureFolders(getRootWorkspaceFolders()),
        'Создать Flutter пакет': createFlutterPackage,
        'Создать навигацию для файла': () => updateRoutingFls(getActiveEditorPath()!),
        'Добавить api сервис в текущий файл': () => addApiService(getActiveEditorPath()!),
        'сделать главной': () => setMainPage(getActiveEditorPath()!),
        'удалить feature': () => deleteFuture(getActiveEditorPath()!),
        'удалить страницу': () => deletePage(getActiveEditorPath()!),
        'Обновить barrel': () => crBarrelFls(getLibPath()),
        'Создать файлы данных': () => createDataFiles(),
        'Добавить serverpod модель': () => addServerpodModel(),
        'Добавить связанную serverpod модель': () => addServerpodMapModel(),
    };

    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}

