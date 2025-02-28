import {
	commands,
	ExtensionContext
} from "vscode";
import {
	addFolders,
	preSnippetGenerate,
	registerCodeActions,
	snippetGenerate,
	writeToTerminal
} from "./commands";
import { flutterHandler } from "./commands/flutter/flutter_handler";
import { pythonHandler } from "./commands/python/python_handler";
import { vsCodeExtHandler } from "./commands/vs_code_ext/vs_code_ext_handler";



export function activate(context: ExtensionContext) {

	registerCodeActions(context);
	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippetGenerate),
		commands.registerCommand('code-helper.pre_snippet_generate', preSnippetGenerate),
		commands.registerCommand('code-helper.add_folders', addFolders),
		commands.registerCommand('code-helper.terminal', writeToTerminal),
		commands.registerCommand("code-helper.myFlutter", flutterHandler),
		commands.registerCommand("code-helper.myPython", pythonHandler),
		commands.registerCommand("code-helper.vsCodeExtHandler", vsCodeExtHandler),
	);
}

export function deactivate() { }
