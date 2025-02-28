import { window } from "vscode";
import { runCommandsSequentially, terminalCommands, writeToTerminal } from "../../utils/terminal_handle";



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


// const reinstallExtCmds = [
//     'vsce package\n',
//     'code --uninstall-extension mrfrolk.code-helper\n',
//     'code --install-extension code-helper-0.0.1.vsix\n'
    
// ];


// async function reinstallExtension() {
//     terminalCommands(reinstallExtCmds);

// }

// async function runCommandsSequentially(commands: string[]) {
//     for (const cmd of commands) {
//         await writeToTerminal(cmd); // Предполагается, что эта функция ожидает выполнение команды перед переходом к следующей
//     }
// }

async function reinstallExtension() {
    const reinstallExtCmds = [
        'vsce package',
        'code --uninstall-extension mrfrolk.code-helper',
        'code --install-extension code-helper-0.0.1.vsix'
    ];
    
    await runCommandsSequentially(reinstallExtCmds);
}