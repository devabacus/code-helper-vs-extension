import {
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";


export const writeToTerminal = function (command="whoami"){
    const terminal = window.createTerminal('My Terminal');
    terminal.show();
    terminal.sendText(command);
};


export function terminalCommands(commands: string[]) {
    
    commands.forEach(command => {
        writeToTerminal(command);		
    });
}

