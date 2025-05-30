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
import { serverpodDataYaml } from "../serverpod/generators/default_server_data_yaml";

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
    // createFolder(path.join(projectsPath, projectName));
    const create_command = `serverpod create ${projectName}`;
    await executeCommand(create_command, projectsPath);
    
    const monoRepoPath = path.join(projectsPath, projectName);
    
    const fullFlutterProjectPath = path.join(monoRepoPath, `${projectName}_flutter`);
    
    const serverPath = path.join(monoRepoPath, `${projectName}_server`);
    await executeCommand(`serverpod generate --experimental-features`, serverPath);

    const serverDataYamlPath = path.join(serverPath, "server_data.yaml");

    createFile(serverDataYamlPath, serverpodDataYaml(projectName));


    if (addTemplateFolders) {
        addTemplateFolders(fullFlutterProjectPath);
    }
    startAppFix(fullFlutterProjectPath);

    insertAtFileEnd(path.join(fullFlutterProjectPath, '.gitignore'), gitignoreCont);

    const serviceFilesPth = path.join(fullFlutterProjectPath, "_service_files");
    const vscodePth = path.join(fullFlutterProjectPath, ".vscode");
    await createFolder(serviceFilesPth);
    await createFolder(vscodePth);


    createRootTemplateFiles(fullFlutterProjectPath);


    createFile(path.join(fullFlutterProjectPath, "pubspec.yaml"), pubspec_yaml(projectName));

    gitInit(monoRepoPath);

    const homePagePath = path.join(fullFlutterProjectPath, 'lib', 'features', 'home', 'presentation', 'pages', 'home_page.dart');
    const openCommand = `code -g "${homePagePath}" "${fullFlutterProjectPath}"`;

    await executeCommand(openCommand, projectsPath);
    await executeCommand(pubGet, fullFlutterProjectPath);
    // insertTextToFile(startApp, mainDartPath);

}
