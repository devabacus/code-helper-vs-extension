import {
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";


export const writeToTerminal = function (command="whoami"){
    const terminal = window.createTerminal('My Terminal');
    terminal.sendText(command);
    terminal.show();
};
