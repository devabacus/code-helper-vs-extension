import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { createFolder, executeCommand } from '../../utils';
import { textValidator } from '../../utils/text_util';
import { getRootWorkspaceFolders } from '../../utils/path_util';
import { getUserInput } from '../../utils/ui/ui_ask_folder';
import { addDependecy } from './flutter_add_pubspec';


export async function createFlutterPackage() {

    const packageName = await getUserInput(
        'Введите название пакета Flutter',
        'my_flutter_package',
        textValidator
    );

    if (!packageName) {
        return;
    }

    const workspaceFolder = getRootWorkspaceFolders();
    const projectPath = path.join(workspaceFolder, packageName);
    const examplePath = path.join(projectPath, 'example');

    try {
        // Шаг 1: Создание Flutter пакета
        await executeCommand(`flutter create --template=package ${packageName}`, workspaceFolder);

        createFolder(examplePath);

        // Шаг 3: Создание Flutter приложения внутри example
        await executeCommand(`flutter create example`, projectPath);

        addDependecy(packageName,examplePath);

        vscode.window.showInformationMessage(`Пакет ${packageName} успешно создан!`);
    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка: ${error}`);
    }
}
