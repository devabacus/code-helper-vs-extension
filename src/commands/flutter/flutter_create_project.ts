import * as path from "path";
import { executeCommand } from "../../utils/terminal_handle";
import { getUserInput, pickPath } from "../../utils/ui/ui_util";
import { addFileFromSnippetFolder } from "../../utils";

export async function flutterCreateNewProject(callback?:(fullProjectPath: string)=>void):Promise<void> {
    
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
    
    if(callback){
        callback(fullProjectPath);
    }
    addFileFromSnippetFolder("flutter_handle.ps1", fullProjectPath);
    //добавление плагина go-router, файлы, папки
    const openCommand = `code -g "${mainDartPath}" "${fullProjectPath}"`;
    
    await executeCommand(openCommand, projectPath);
    
    // insertTextToFile(startApp, mainDartPath);

}
