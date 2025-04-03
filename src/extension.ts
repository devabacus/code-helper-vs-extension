import {
	commands,
	ExtensionContext
} from "vscode";
import { registerCodeActions } from "./ui/code_action_provider";
import { preSnippetGenerate, snippetGenerate } from "@utils";

import { vsCodeExtHandler } from "./utils/vs_code_ext/vs_code_menu";
import { flutterHandler } from "./ui/flutter_menu";


export function activate(context: ExtensionContext) {

	registerCodeActions(context);
	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippetGenerate),
		commands.registerCommand('code-helper.pre_snippet_generate', preSnippetGenerate),
		commands.registerCommand("code-helper.myFlutter", flutterHandler),
		commands.registerCommand("code-helper.vsCodeExtHandler", vsCodeExtHandler),
	);
}

export function deactivate() { }
