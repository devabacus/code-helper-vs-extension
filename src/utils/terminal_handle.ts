import {
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";


import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);


export async function writeToTerminal (command="whoami"){
    const terminal = window.createTerminal('My Terminal');
    terminal.show();
    terminal.sendText(command);
};





export async function terminalCommands(commands: string[], cwd: string):Promise<void> {
    
    for (const command of commands) {
        await executeCommand(command, cwd);
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


