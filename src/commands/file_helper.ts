import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * Копирует файл PowerShell из папки `ps_files` в корень проекта (workspace).
 * @param fileName Имя файла (например, "flutter_handle.ps1")
 */


export function copyPowerShellFile(fileName: string) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("❌ Откройте проект, чтобы добавить PowerShell файл");
        return;
    }

    const projectRoot = workspaceFolders[0].uri.fsPath; // Корневой путь проекта
    const destinationPath = path.join(projectRoot, fileName);

    // Определяем путь к файлу в расширении
    const extensionPath = vscode.extensions.getExtension("mrfrolk.code-helper")?.extensionPath;
    if (!extensionPath) {
        vscode.window.showErrorMessage("❌ Не удалось определить путь расширения");
        return;
    }

    const sourcePath = path.join(extensionPath, "src/ps_files", fileName);

    // Проверяем, существует ли файл в папке расширения
    if (!fs.existsSync(sourcePath)) {
        vscode.window.showErrorMessage(`❌ Файл ${fileName} не найден в папке ps_files`);
        return;
    }

    // Копируем файл в workspace
    fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
            vscode.window.showErrorMessage(`❌ Ошибка при копировании файла: ${err.message}`);
        } else {
            vscode.window.showInformationMessage(`✅ Файл ${fileName} успешно добавлен в проект`);
            // Открываем файл в VS Code
            vscode.workspace.openTextDocument(destinationPath).then((doc) => {
                vscode.window.showTextDocument(doc);
            });
        }
    });
}
