import { window } from "vscode";
import { terminalCommands } from "../utils";
import { getRootWorkspaceFolders } from "../utils/path_util";



export async function gitInit(path: string) {
    const gitInitSet = [
        'git init',
        'git add .',
        'git commit -m "init"'
    ];
   await terminalCommands(gitInitSet, path);
   window.showInformationMessage('✅ Git инициализирован!');
}
