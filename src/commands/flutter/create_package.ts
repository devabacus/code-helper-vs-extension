import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

/**
 * Выполняет команду в терминале и возвращает промис
 */
function executeCommand(command: string, cwd?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const terminal = vscode.window.createTerminal('Flutter Package Setup');
        terminal.show();
        terminal.sendText(command);
        resolve();
    });
}

/**
 * Создаёт новый Flutter пакет и добавляет его в example
 */
export async function createFlutterPackage() {
    const packageName = await vscode.window.showInputBox({
        prompt: 'Введите название пакета Flutter',
        placeHolder: 'my_flutter_package',
        validateInput: (text) => text.match(/^[a-z_][a-z0-9_]*$/) ? null : 'Название должно содержать только маленькие буквы, цифры и _',
    });

    if (!packageName) {
        vscode.window.showErrorMessage('Название пакета не задано.');
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Откройте рабочую папку перед созданием пакета.');
        return;
    }

    const projectPath = path.join(workspaceFolders[0].uri.fsPath, packageName);
    const examplePath = path.join(projectPath, 'example');

    try {
        // Шаг 1: Создание Flutter пакета
        await executeCommand(`flutter create --template=package ${packageName}`, workspaceFolders[0].uri.fsPath);

        // Шаг 2: Создание папки example
        fs.mkdirSync(examplePath, { recursive: true });

        // Шаг 3: Создание Flutter приложения в example
        await executeCommand(`flutter create .`, examplePath);

        // Шаг 4: Добавление зависимости в pubspec.yaml
        const pubspecPath = path.join(examplePath, 'pubspec.yaml');
        let pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
        pubspecContent = pubspecContent.replace(
            'dependencies:',
            `dependencies:\n  ${packageName}:\n    path: ../`
        );
        fs.writeFileSync(pubspecPath, pubspecContent);

        vscode.window.showInformationMessage(`Пакет ${packageName} успешно создан!`);
    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка: ${error}`);
    }
}
