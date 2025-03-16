import {
	commands,
	ExtensionContext
} from "vscode";
import {
	preSnippetGenerate,
	registerCodeActions,
	snippetGenerate
} from "./commands";
import { flutterHandler } from "./commands/flutter/flutter_menu";
import { pythonHandler } from "./commands/python/python_menu";
import { vsCodeExtHandler } from "./commands/vs_code_ext/vs_code_menu";
import { registerTreeViewProvider } from "./treeviews/codeHelperTreeView";



export function activate(context: ExtensionContext) {

	registerTreeViewProvider(context);


	registerCodeActions(context);
	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippetGenerate),
		commands.registerCommand('code-helper.pre_snippet_generate', preSnippetGenerate),
		commands.registerCommand("code-helper.myFlutter", flutterHandler),
		commands.registerCommand("code-helper.myPython", pythonHandler),
		commands.registerCommand("code-helper.vsCodeExtHandler", vsCodeExtHandler),
	);
}

export function deactivate() { }
