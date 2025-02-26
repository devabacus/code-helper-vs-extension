import {
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
} from "vscode";
import {
	snippetGenerate, newFeature, writeToTerminal, registerCodeActions, startFlutter
}
	from "./commands";



export function activate(context: ExtensionContext) {

	registerCodeActions(context);
	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippetGenerate),
		commands.registerCommand('code-helper.new_feature', newFeature),
		commands.registerCommand('code-helper.terminal', writeToTerminal),
		commands.registerCommand("code-helper.startFlutter", startFlutter)

	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
