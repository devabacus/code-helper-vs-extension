import * as path from "path";
import { createFile, createFolder } from "../../../utils";
import { executeCommand } from "../../../utils/terminal_handle";
import { getUserInput, pickPath } from "../../../utils/ui/ui_ask_folder";
import { gitInit } from "../../git_init";
import { addDependecy } from "./add_pubspec/flutter_add_pubspec";
import { pubspec_yaml } from "./flutter_content/files_content/pubspec_yaml";
import { startDependency } from "./flutter_content/package_pubscpec";
import { pubGet } from "./flutter_content/terminal_commands";
import { flutter_handle_ps1 } from "./service_files/flutter_handle_ps1";
import { git_handle_ps1 } from "./service_files/git_handle_ps1";
import { startAppFix } from "./start_app_fix";
import { addDriftDB } from "./flutter_content/drift_db/add_drift_db";

export async function flutterCreateNewProject(addTemplateFolders?: (fullProjectPath: string) => void): Promise<void> {



    // пользователь выбирает категории 
    const projectPath = await pickPath();
    if (!projectPath) {
        return;
    }
    const projectName = await getUserInput('введите название Flutter проекта');
    if (!projectName) {
        return;
    }
    const create_command = `flutter create ${projectName}`;
    const fullProjectPath = path.join(projectPath, projectName);
    // G:\Projects\Flutter\a14\lib\features\home\presentation\pages\home_page.dart
    await executeCommand(create_command, projectPath);
    await addDependecy(startDependency, fullProjectPath);


    if (addTemplateFolders) {
        addTemplateFolders(fullProjectPath);
    }
    startAppFix(fullProjectPath);

    const serviceFilesPth = path.join(fullProjectPath, "_service_files");
    await createFolder(serviceFilesPth);

    createFile(path.join(serviceFilesPth, "flutter_handle.ps1"), flutter_handle_ps1);
    createFile(path.join(serviceFilesPth, "git_handle.ps1"), git_handle_ps1);
    createFile(path.join(serviceFilesPth, "shell_commands.ps1"), "//shell commands");
    createFile(path.join(fullProjectPath, "pubspec.yaml"), pubspec_yaml(projectName));

    await addDriftDB(projectPath);

    gitInit(fullProjectPath);

    const homePagePath = path.join(fullProjectPath, 'lib', 'features', 'home', 'presentation', 'pages', 'home_page.dart');
    const openCommand = `code -g "${homePagePath}" "${fullProjectPath}"`;

    await executeCommand(openCommand, projectPath);
    await executeCommand(pubGet, fullProjectPath);
    // insertTextToFile(startApp, mainDartPath);

}
