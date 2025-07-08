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
            const targetRange = location.targetSelectionRange || location.targetRange;
            
            // Используем goToLocations для корректной навигации
            try {
                await vscode.commands.executeCommand(
                    'editor.action.goToLocations',
                    context.document.uri,
                    context.position,
                    [new vscode.Location(location.targetUri, targetRange)],
                    'goto',
                    'Default Definition Navigation'
                );
                return;
            } catch (e) {
                console.log('goToLocations failed, trying alternative approach');
            }

            // Альтернативный подход если goToLocations не работает
            const targetUri = location.targetUri;
            await vscode.commands.executeCommand(
                'vscode.open',
                targetUri,
                {
                    selection: targetRange,
                    viewColumn: vscode.ViewColumn.Active
                }
            );

            // Дополнительно устанавливаем позицию и выделение
            const targetEditor = vscode.window.activeTextEditor;
            if (targetEditor) {
                targetEditor.selection = new vscode.Selection(targetRange.start, targetRange.end);
                targetEditor.revealRange(targetRange, vscode.TextEditorRevealType.InCenter);
            }
        }
    } catch (error) {
        console.error('Ошибка при выполнении стандартного go to definition:', error);
    }
}


export async function executeDefaultPeekDefinition(context: DefinitionContext): Promise<void> {
    try {
        // Получаем стандартные определения
        const definitions = await vscode.commands.executeCommand<vscode.LocationLink[]>(
            'vscode.executeDefinitionProvider',
            context.document.uri,
            context.position
        );
        
        if (definitions && definitions.length > 0) {
            // Используем showReferences для показа peek окна с найденными определениями
            await vscode.commands.executeCommand(
                'editor.action.showReferences',
                context.document.uri,
                context.position,
                definitions.map(def => new vscode.Location(def.targetUri, def.targetSelectionRange || def.targetRange))
            );
        }
    } catch (error) {
        console.error('Ошибка при выполнении стандартного peek definition:', error);
    }
}