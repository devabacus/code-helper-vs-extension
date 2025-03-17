import * as path from "path";
import { executeCommand } from "../../../utils/terminal_handle";
import { addFileFromSnippetFolder } from "../../../utils";
import { gitInit } from "../../git_init";
import { startDependency } from "../flutter_content/package_pubscpec";
import { addDependecy } from "../flutter_add_pubspec";
import { getUserInput, pickPath } from "../../../utils/ui/ui_ask_folder";

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
    const mainDartPath = path.join(fullProjectPath, 'lib', 'main.dart');

    await executeCommand(create_command, projectPath);
    await addDependecy(startDependency, fullProjectPath);


    if (addTemplateFolders) {
        addTemplateFolders(fullProjectPath);
    }
    addFileFromSnippetFolder("flutter_handle.ps1", fullProjectPath);
    addFileFromSnippetFolder("git_handle.ps1", fullProjectPath);
    gitInit(fullProjectPath);


    const openCommand = `code -g "${mainDartPath}" "${fullProjectPath}"`;

    await executeCommand(openCommand, projectPath);



    // insertTextToFile(startApp, mainDartPath);

}
