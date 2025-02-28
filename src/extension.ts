import {
	commands,
	ExtensionContext
} from "vscode";
import {
	addFolders,
	registerCodeActions,
	snippetGenerate,
	writeToTerminal
} from "./commands";
import { flutterHandler } from "./commands/flutter/flutter_handler";



export function activate(context: ExtensionContext) {

	registerCodeActions(context);
	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippetGenerate),
		commands.registerCommand('code-helper.add_folders', addFolders),
		commands.registerCommand('code-helper.terminal', writeToTerminal),
		commands.registerCommand("code-helper.myFlutter", flutterHandler)
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
