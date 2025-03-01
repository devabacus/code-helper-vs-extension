import { window } from "vscode";
import { executeCommand, terminalCommands } from "../../utils";
import { getRootWorkspaceFolders } from "../../utils/path_util";


export async function vsCodeExtHandler() {
    const options: { [key: string]: () => Promise<void> } = {

        'Переустановить расширение': reinstallExtension,
    };

    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}


async function reinstallExtension() {
    const reinstallExtCmds = [
        'git init',
        'git add .',
        'git commit -m "ivan durak"'
        // 'vsce package',
        // 'code --uninstall-extension mrfrolk.code-helper',
        // 'code --install-extension code-helper-0.0.1.vsix'
    ];
   await terminalCommands(reinstallExtCmds, getRootWorkspaceFolders());
   
    //TODO need to implement run commands
}

