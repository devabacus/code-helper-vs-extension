import * as path from "path";
import { addFileFromSnippetFolder, createFile } from "../../../utils";
import { executeCommand } from "../../../utils/terminal_handle";
import { getUserInput, pickPath } from "../../../utils/ui/ui_ask_folder";
import { gitInit } from "../../git_init";
import { addDependecy } from "../flutter_add_pubspec";
import { startDependency } from "./flutter_content/package_pubscpec";
import { startAppFix } from "../handle_work/start_app_fix";

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

    addFileFromSnippetFolder("flutter_handle.ps1", fullProjectPath);
    addFileFromSnippetFolder("git_handle.ps1", fullProjectPath);
    createFile("shell_commands.ps1", fullProjectPath);
    gitInit(fullProjectPath);

    // const mainDartPath = path.join(fullProjectPath, 'lib', 'main.dart');
    // const openCommand = `code -g "${mainDartPath}" "${fullProjectPath}"`;

    const homePagePath = path.join(fullProjectPath, 'lib', 'features', 'home', 'presentation', 'pages', 'home_page.dart');
    const openCommand = `code -g "${homePagePath}" "${fullProjectPath}"`;

    await executeCommand(openCommand, projectPath);
    // insertTextToFile(startApp, mainDartPath);

}
