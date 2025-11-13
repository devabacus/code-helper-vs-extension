// src/utils/go_to_definition/peek_to_definition_provider.ts
import * as vscode from 'vscode';
import * as fs from 'fs';

function toPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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

        const pascalCaseName = toPascalCase(targetSymbolName);
        const camelCaseName = targetSymbolName;

        // Ищем символ (класс или функцию), перед которым есть аннотация @Riverpod
        const regex = new RegExp(`@riverpod(?:\\([^)]*\\))?\\s*.*?\\b(${pascalCaseName}|${camelCaseName})\\b`, 'gis');
        const match = regex.exec(targetFileContent);

        let symbolIndex = -1;
        let actualSymbolName = '';

        if (match) {
            // Найдено совпадение с аннотацией.
            // `match.index` - это начало "@Riverpod". Нам нужен индекс самого символа.
            actualSymbolName = match[1];
            // Ищем позицию символа после найденной аннотации
            symbolIndex = targetFileContent.indexOf(actualSymbolName, match.index);
        }

        if (symbolIndex !== -1) {
            const targetUri = vscode.Uri.file(targetFilePath);
            const targetDocument = await vscode.workspace.openTextDocument(targetUri);
            const startPosition = targetDocument.positionAt(symbolIndex);
            const endPosition = targetDocument.positionAt(symbolIndex + actualSymbolName.length);
            const targetRange = new vscode.Range(startPosition, endPosition);

            const location = new vscode.Location(targetUri, targetRange);

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