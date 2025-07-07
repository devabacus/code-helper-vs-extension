// src/utils/go_to_definition/definition_router.ts
import * as vscode from 'vscode';

export interface DefinitionContext {
    editor: vscode.TextEditor;
    document: vscode.TextDocument;
    position: vscode.Position;
    wordRange: vscode.Range | undefined;
    word: string;
}

export function getDefinitionContext(): DefinitionContext | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return null;
    
    const document = editor.document;
    const position = editor.selection.active;
    const wordRange = document.getWordRangeAtPosition(position);
    const word = wordRange ? document.getText(wordRange) : '';
    
    return {
        editor,
        document,
        position,
        wordRange,
        word
    };
}

export function shouldUseCustomLogic(context: DefinitionContext): boolean {
    return context.word.endsWith('Provider') && context.wordRange !== undefined;
}

export async function executeDefaultGoToDefinition(context: DefinitionContext): Promise<void> {
    try {
        // Получаем стандартные определения
        const definitions = await vscode.commands.executeCommand<vscode.LocationLink[]>(
            'vscode.executeDefinitionProvider',
            context.document.uri,
            context.position
        );
        
        if (definitions && definitions.length > 0) {
            const location = definitions[0];
            const doc = await vscode.workspace.openTextDocument(location.targetUri);
            const editor = await vscode.window.showTextDocument(doc);
            const range = location.targetSelectionRange || location.targetRange;
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
        }
    } catch (error) {
        console.error('Ошибка при выполнении стандартного go to definition:', error);
    }
}

export async function executeDefaultPeekDefinition(context: DefinitionContext): Promise<void> {
    try {
        // Используем стандартную команду peek
        await vscode.commands.executeCommand('editor.action.peekDeclaration');
    } catch (error) {
        console.error('Ошибка при выполнении стандартного peek definition:', error);
    }
}