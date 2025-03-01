import * as vscode from "vscode";
import * as path from "path";
import { executeCommand, writeToTerminal } from "../../utils/terminal_handle";
import { getUserInput, pickPath } from "../../utils/ui/ui_util";
import { getUserInputWrapper } from "../../utils/ui/ui_ask_folder";
import { startFlutterAppRouter } from "./start_flutter_app";
import { insertTextToFile } from "../../utils";
import { startApp, startAppWithRoute } from "./flutter_content/flutter_content";
import * as fs from 'fs';
import { addGoRouterPackage } from "./flutter_content/flutter_commands";
import { createFlutterRouterFiles } from "./create_folders";







export async function flutterCreateNewProject():Promise<void> {
    
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
    
    await executeCommand(addGoRouterPackage, fullProjectPath);

    createFlutterRouterFiles(fullProjectPath);
    fs.writeFileSync(mainDartPath, startAppWithRoute, { encoding: "utf-8" });
    
    const openCommand = `code -g "${mainDartPath}" "${fullProjectPath}"`;
    
    await executeCommand(openCommand, projectPath);

    // insertTextToFile(startApp, mainDartPath);

}
