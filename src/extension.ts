import {
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";
import { 
	 snippet_generate, newFeature,
	 }
	from "./commands";



export function activate(context: ExtensionContext) {


	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippet_generate),
		commands.registerCommand('code-helper.new_feature', newFeature),
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
