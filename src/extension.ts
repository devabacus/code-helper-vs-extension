import {
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";
import { 
	 snippet_generate}
	from "./commands";



export function activate(context: ExtensionContext) {


	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippet_generate),
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
