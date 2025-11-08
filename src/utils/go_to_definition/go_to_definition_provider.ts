// src/utils/go_to_definition/go_to_definition_provider.ts
import * as vscode from 'vscode';
import * as fs from 'fs';

function toPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function customGoToDefinition(
    document: vscode.TextDocument, 
    position: vscode.Position, 
    word: string
): Promise<void> {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
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
        
        // Пробуем найти сначала camelCase (для функций), потом PascalCase (для классов)
        let symbolIndex = targetFileContent.indexOf(targetSymbolName);
        let actualSymbolName = targetSymbolName;
        
        if (symbolIndex === -1) {
            actualSymbolName = toPascalCase(targetSymbolName);
            symbolIndex = targetFileContent.indexOf(actualSymbolName);
        }

        if (symbolIndex !== -1) {
            const targetUri = vscode.Uri.file(targetFilePath);
            const targetDocument = await vscode.workspace.openTextDocument(targetUri);
            const startPosition = targetDocument.positionAt(symbolIndex);
            const endPosition = startPosition.translate(0, actualSymbolName.length);
            const targetRange = new vscode.Range(startPosition, endPosition);

            await vscode.commands.executeCommand(
                'editor.action.goToLocations',
                document.uri,
                position,
                [new vscode.Location(targetUri, targetRange)],
                'goto',
                'Navigation from custom provider'
            );
        }
    } catch (error) {
        console.error(`Ошибка при переходе к определению Riverpod: ${error}`);
        vscode.window.showErrorMessage('Не удалось перейти к определению.');
    }
}