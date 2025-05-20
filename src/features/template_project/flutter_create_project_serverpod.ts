import * as path from "path";
import { createFile, createFolder } from "../../utils";
import { executeCommand } from "../../utils/terminal_handle";
import { insertAtFileEnd } from "../../utils/text_work/text_insert/basic-insertion";
import { getUserInput, pickPath } from "../../utils/ui/ui_ask_folder";
import { gitInit } from "../git_init";
import { addDependecy } from "./add_pubspec/flutter_add_pubspec";
import { createRootTemplateFiles } from "./flutter_add_template_file";
import { pubspec_yaml } from "./flutter_content/files_content/pubspec_yaml";
import { startDependency } from "./flutter_content/package_pubscpec";
import { pubGet } from "./flutter_content/terminal_commands";
import { startAppFix } from "./start_app_fix";
import { gitignoreCont } from "./flutter_content/files_content/_gitignore";

export async function flutterCreateNewServerPodProject(addTemplateFolders?: (fullProjectPath: string) => void): Promise<void> {

    // пользователь выбирает категории 
    const projectsPath = await pickPath();
    if (!projectsPath) {
        return;
    }
    const projectName = await getUserInput('введите название проекта');
    if (!projectName) {
        return;
    }
    createFolder(path.join(projectsPath, projectName));
    const create_command = `serverpod create ${projectName}`;
    const projectPath = path.join(projectsPath, projectName);
    await executeCommand(create_command, projectPath);
    const fullProjectPath = path.join(projectPath, `${projectName}_flutter`);
    
    if (addTemplateFolders) {
        addTemplateFolders(fullProjectPath);
    }
    startAppFix(fullProjectPath);

    insertAtFileEnd(path.join(fullProjectPath, '.gitignore'), gitignoreCont);

    const serviceFilesPth = path.join(fullProjectPath, "_service_files");
    const vscodePth = path.join(fullProjectPath, ".vscode");
    await createFolder(serviceFilesPth);
    await createFolder(vscodePth);


    createRootTemplateFiles(fullProjectPath);


    // createFile(path.join(serviceFilesPth, "flutter_handle.ps1"), flutter_handle_ps1);
    // createFile(path.join(serviceFilesPth, "git_handle.ps1"), git_handle_ps1);
    // createFile(path.join(serviceFilesPth, "shell_commands.ps1"), "//shell commands");
    createFile(path.join(fullProjectPath, "pubspec.yaml"), pubspec_yaml(projectName));



    gitInit(fullProjectPath);

    const homePagePath = path.join(fullProjectPath, 'lib', 'features', 'home', 'presentation', 'pages', 'home_page.dart');
    const openCommand = `code -g "${homePagePath}" "${fullProjectPath}"`;

    await executeCommand(openCommand, projectsPath);
    await executeCommand(pubGet, fullProjectPath);
    // insertTextToFile(startApp, mainDartPath);

}
