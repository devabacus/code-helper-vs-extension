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


export function terminalCommands(commands: string[]) {
    
    commands.forEach(command => {
        writeToTerminal(command);		
    });
}


export async function runCommandsSequentially(commands: string[]) {
    for (const cmd of commands) {
        console.log(`Executing: ${cmd}`);
        try {
            const { stdout, stderr } = await execAsync(cmd, { shell: "powershell" });
            if (stdout) console.log("Output:", stdout);
            if (stderr) console.error("Error:", stderr);
        } catch (error) {
            console.error(`Command failed: ${cmd}`, error);
        }
    }
}

