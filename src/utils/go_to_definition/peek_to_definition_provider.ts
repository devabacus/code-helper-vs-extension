// src/utils/go_to_definition/peek_to_definition_provider.ts
import * as vscode from 'vscode';
import * as fs from 'fs';

export async function customPeekDefinition(
    document: vscode.TextDocument, 
    position: vscode.Position, 
    word: string
): Promise<void> {
    try {
        const defaultDefinitions = await vscode.commands.executeCommand<vscode.LocationLink[]>(
            'vscode.executeDefinitionProvider',
            document.uri,
            position
        );

        if (!defaultDefinitions || defaultDefinitions.length === 0) return;

        const definitionPath = defaultDefinitions[0].targetUri.fsPath;
        if (!definitionPath.endsWith('.g.dart')) return;

        const targetFilePath = definitionPath.replace('.g.dart', '.dart');
        if (!fs.existsSync(targetFilePath)) return;

        const targetSymbolName = word.substring(0, word.length - 'Provider'.length);
        const targetFileContent = fs.readFileSync(targetFilePath, 'utf8');
        const symbolIndex = targetFileContent.indexOf(targetSymbolName);

        if (symbolIndex !== -1) {
            const targetUri = vscode.Uri.file(targetFilePath);
            const targetDocument = await vscode.workspace.openTextDocument(targetUri);
            const startPosition = targetDocument.positionAt(symbolIndex);
            const endPosition = startPosition.translate(0, targetSymbolName.length);
            const targetRange = new vscode.Range(startPosition, endPosition);
            
            // Создаем location для peek
            const location = new vscode.Location(targetUri, targetRange);
            
            // Используем showReferences для показа peek окна
            await vscode.commands.executeCommand(
                'editor.action.showReferences',
                document.uri,
                position,
                [location]
            );
        }
    } catch (error) {
        console.error(`Ошибка при peek definition: ${error}`);
    }
}