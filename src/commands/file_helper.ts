import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * Копирует файл PowerShell из папки `ps_files` в корень проекта (workspace).
 * @param fileName Имя файла (например, "flutter_handle.ps1")
 */

function getUserSnippetsPath(): string {
    return path.join(process.env.APPDATA || "", "Code", "User", "snippets");
}

/**
 * Копирует `.ps1` файл из `User Snippets` в корень проекта.
 * @param fileName Имя файла (например, "flutter_handle.ps1")
 */
export async function addFileFromSnippetFolder(fileName: string) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("❌ Откройте проект, чтобы добавить PowerShell файл");
        return;
    }

    const projectRoot = workspaceFolders[0].uri.fsPath;
    const destinationPath = path.join(projectRoot, fileName);
    const snippetsPath = getUserSnippetsPath();
    const sourcePath = path.join(snippetsPath, fileName);

    if (!fs.existsSync(sourcePath)) {
        vscode.window.showErrorMessage(`❌ Файл ${fileName} не найден в User Snippets`);
        return;
    }

    fs.copyFileSync(sourcePath, destinationPath);
    vscode.window.showInformationMessage(`✅ Файл ${fileName} добавлен из User Snippets`);

    // Открываем файл в VS Code
    vscode.workspace.openTextDocument(destinationPath).then((doc) => {
        vscode.window.showTextDocument(doc);
    });
}
