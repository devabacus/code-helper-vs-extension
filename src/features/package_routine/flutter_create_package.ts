import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import { addDependecy } from '../template_project/add_pubspec/flutter_add_pubspec';
import { new_local_package } from '../template_project/flutter_content/package_pubscpec';
import { getUserInput, pickPath } from '../../utils/ui/ui_ask_folder';
import { textValidator } from '../../utils/text_work/text_util';
import { createFolder, executeCommand } from '../../utils';


export async function createFlutterPackage() {

    const workspaceFolder = await pickPath();
    if (!workspaceFolder) { return; }

    const packageName = await getUserInput(
        'Введите название пакета Flutter',
        'my_flutter_package',
        textValidator
    );

    if (!packageName) { return; }

    // const workspaceFolder = getRootWorkspaceFolders();

    const projectPath = path.join(workspaceFolder!, packageName);
    const examplePath = path.join(projectPath, 'example');

    try {
        // Шаг 1: Создание Flutter пакета
        await executeCommand(`flutter create --template=package ${packageName}`, workspaceFolder!);

        createFolder(examplePath);

        // Шаг 3: Создание Flutter приложения внутри example
        await executeCommand(`flutter create example`, projectPath);

        addDependecy(new_local_package(packageName), examplePath);
        const pkgMainFlPth = path.join("lib", `${packageName}.dart`);

        const openCommand = `code -g "${pkgMainFlPth}" "${projectPath}"`;
        await executeCommand(openCommand, projectPath);


        vscode.window.showInformationMessage(`Пакет ${packageName} успешно создан!`);
    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка: ${error}`);
    }
}
