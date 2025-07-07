// src/utils/go_to_definition/go_to_definition_provider.ts
import * as vscode from 'vscode';
import * as fs from 'fs';

export async function customGoToDefinition(
    document: vscode.TextDocument, 
    position: vscode.Position, 
    word: string
): Promise<void> {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Узнаем, куда ведет стандартное определение
        const defaultDefinitions = await vscode.commands.executeCommand<vscode.LocationLink[]>(
            'vscode.executeDefinitionProvider',
            document.uri,
            position
        );

        if (!defaultDefinitions || defaultDefinitions.length === 0) return;

        const definitionPath = defaultDefinitions[0].targetUri.fsPath;
        if (!definitionPath.endsWith('.g.dart')) return;

        // Формируем путь к исходному файлу
        const targetFilePath = definitionPath.replace('.g.dart', '.dart');
        if (!fs.existsSync(targetFilePath)) return;

        const targetSymbolName = word.substring(0, word.length - 'Provider'.length);
        const targetFileContent = fs.readFileSync(targetFilePath, 'utf8');
        const symbolIndex = targetFileContent.indexOf(targetSymbolName);

        if (symbolIndex !== -1) {
            // Нашли! Открываем файл и перемещаем курсор
            const targetUri = vscode.Uri.file(targetFilePath);
            const targetDocument = await vscode.workspace.openTextDocument(targetUri);
            const targetEditor = await vscode.window.showTextDocument(targetDocument);

            const startPosition = targetDocument.positionAt(symbolIndex);
            const endPosition = startPosition.translate(0, targetSymbolName.length);
            
            targetEditor.selection = new vscode.Selection(startPosition, endPosition);
            targetEditor.revealRange(new vscode.Range(startPosition, endPosition), vscode.TextEditorRevealType.InCenter);
        }
    } catch (error) {
        console.error(`Ошибка при переходе к определению Riverpod: ${error}`);
        vscode.window.showErrorMessage('Не удалось перейти к определению.');
    }
}