import {
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";
import {
	snippetGenerate, addFolders, writeToTerminal, registerCodeActions,
	selectAndAddPowerShellScript, 
}
	from "./commands";



export function activate(context: ExtensionContext) {

	registerCodeActions(context);
	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippetGenerate),
		commands.registerCommand('code-helper.add_folders', addFolders),
		commands.registerCommand('code-helper.terminal', writeToTerminal),
		commands.registerCommand("code-helper.startApp", selectAndAddPowerShellScript)

	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
