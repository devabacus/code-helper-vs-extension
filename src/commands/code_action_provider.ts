import * as vscode from "vscode";

export class CodeHelperProvider implements vscode.CodeActionProvider {
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeAction[]> {
        const actions: vscode.CodeAction[] = [];

        const snippetAction = new vscode.CodeAction(
            "Generate Snippet",
            vscode.CodeActionKind.QuickFix
        );
        snippetAction.command = {
            command: "code-helper.snippet_generate",
            title: "Generate Snippet"
        };

        const newFeatureAction = new vscode.CodeAction(
            "New Feature",
            vscode.CodeActionKind.QuickFix
        );
        newFeatureAction.command = {
            command: "code-helper.new_feature",
            title: "New Feature"
        };

        actions.push(snippetAction,
            //  newFeatureAction
            );
        return actions;
    }
}

export function registerCodeActions(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { scheme: "file", language: "dart" }, // Можно изменить на TypeScript, JavaScript и т. д.
            new CodeHelperProvider(),
            {
                providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
            }
        )
    );
}
