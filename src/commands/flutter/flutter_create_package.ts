import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { executeCommand } from '../../utils';
import { addPubSpecDependency } from './flutter_util';
import { textValidator } from '../../utils/text_util';
import { getRootWorkspaceFolders } from '../../utils/path_util';
import { getUserInput } from '../../utils/ui/ui_util';



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

        // Шаг 2: Создание папки example
        fs.mkdirSync(examplePath, { recursive: true });

        // Шаг 3: Создание Flutter приложения внутри example
        await executeCommand(`flutter create example`, projectPath);

        addPubSpecDependency(examplePath, packageName);

        vscode.window.showInformationMessage(`Пакет ${packageName} успешно создан!`);
    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка: ${error}`);
    }
}
