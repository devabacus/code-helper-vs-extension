import {
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";


export const writeToTerminal = function (){
    const terminal = window.createTerminal('My Terminal');
    terminal.sendText('whoami');
    terminal.show();
};
