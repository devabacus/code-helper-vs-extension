// src/extension.ts
import {
	commands,
	ExtensionContext
} from "vscode";
import { registerCodeActions } from "./ui/code_action_provider";
import { flutterHandler } from "./ui/flutter_menu";
import { goToDefinition, peekDefinition } from "./utils/go_to_definition/handlers";
import { preSnippetGenerate, snippetGenerate } from "./utils/snippet_generator/snippet_generate";
import { vsCodeExtHandler } from "./vs_code_ext/vs_code_menu";

export function activate(context: ExtensionContext) {
	registerCodeActions(context);
	context.subscriptions.push(
		commands.registerCommand('code-helper.snippet_generate', snippetGenerate),
		commands.registerCommand('editor.action.revealDefinition', goToDefinition),
		commands.registerCommand('editor.action.peekDefinition', peekDefinition),
		commands.registerCommand('code-helper.pre_snippet_generate', preSnippetGenerate),
		commands.registerCommand("code-helper.myFlutter", flutterHandler),
		commands.registerCommand("code-helper.vsCodeExtHandler", vsCodeExtHandler),		
	);
}

export function deactivate() { }