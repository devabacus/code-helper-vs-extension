import {
    window
} from "vscode";
import { exec } from "child_process";

export async function writeToTerminal (command="whoami"){
    const terminal = window.createTerminal('My Terminal');
    terminal.show();
    terminal.sendText(command);
};

export async function terminalCommands(commands: string[], path: string):Promise<void> {
    
    for (const command of commands) {
        await executeCommand(command, path);
   window.showInformationMessage(`${command}`);

    }
}

export function executeCommand(command: string, cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                window.showErrorMessage(`Ошибка: ${stderr || error.message}`);
                reject(error);
            } else {
                resolve();
            }
        });
    });
}


