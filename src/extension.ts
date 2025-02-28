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
import { flutterHandler } from "./commands/flutter/flutter_handler";
import { startFlutterApp } from "./commands/flutter/start_flutter_app";
import { snippetGenerateWithWrapper } from "./commands/snippet_generator/snippet_generate2";



export function activate(context: ExtensionContext) {

	registerCodeActions(context);
	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippetGenerate),
		commands.registerCommand('code-helper.add_folders', addFolders),
		commands.registerCommand('code-helper.terminal', writeToTerminal),
		// commands.registerCommand("code-helper.startApp", startFlutterApp),
		commands.registerCommand("code-helper.myFlutter", flutterHandler)
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
