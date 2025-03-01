import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getRootWorkspaceFolders, getUserSnippetsPath } from "./path_util";





export async function addFileFromSnippetFolder(fileName: string) {


    const projectRoot = getRootWorkspaceFolders();
    const destinationPath = path.join(projectRoot, fileName);
    const snippetsPath = getUserSnippetsPath();
    const sourcePath = path.join(snippetsPath, fileName);

    if (!fs.existsSync(sourcePath)) {
        vscode.window.showErrorMessage(`❌ Файл ${fileName} не найден в User Snippets`);
        return;
    }

    fs.copyFileSync(sourcePath, destinationPath);
    vscode.window.showInformationMessage(`✅ Файл ${fileName} добавлен из User Snippets`);
}
