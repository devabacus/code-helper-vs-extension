import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getRootWorkspaceFolders, getUserSnippetsPath } from "./path_util";





export async function addFileFromSnippetFolder(fileName: string, projectPath?: string) {
    let _projectPath;

    if (!projectPath) {
        _projectPath = getRootWorkspaceFolders();
    } else {
        _projectPath = projectPath;
    }
    const destinationPath = path.join(_projectPath, fileName);

    const snippetsPath = getUserSnippetsPath();
    const sourcePath = path.join(snippetsPath, fileName);

    if (!fs.existsSync(sourcePath)) {
        vscode.window.showErrorMessage(`Файл ${fileName} не найден в User Snippets`);
        return;
    }

    fs.copyFileSync(sourcePath, destinationPath);
    vscode.window.showInformationMessage(`Файл ${fileName} добавлен из User Snippets`);
}


export function writeToFile(path: string, content: string) {
    fs.writeFileSync(path, content, { encoding: "utf-8" });
}
