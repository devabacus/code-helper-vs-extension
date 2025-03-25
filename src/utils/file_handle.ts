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


export function replaceTextInFile(filePath: string, oldText: string | RegExp, newText: string) {
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });
    const newContent = content.replace(oldText, newText);
    fs.writeFileSync(filePath, newContent, { encoding: "utf-8" });
}

export function isFileContains(filePath: string, mtext: string): boolean {
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });
    if (content.includes(mtext)) {return true;}
    return false;
}
