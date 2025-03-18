import * as vscode from 'vscode';

// Умная вставка текста с определением контекста (функция, класс, импорт и т.д.)
export const insertInContext = async (contextType: 'function' | 'class' | 'import', insertText: string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}
    
    const document = editor.document;
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider',
        document.uri
    );
    
    if (!symbols) {return;}
    
    let targetRange: vscode.Range | undefined;
    for (const symbol of symbols) {
        if ((contextType === 'function' && symbol.kind === vscode.SymbolKind.Function) ||
            (contextType === 'class' && symbol.kind === vscode.SymbolKind.Class) ||
            (contextType === 'import' && symbol.kind === vscode.SymbolKind.Module)) {
            targetRange = symbol.range;
            break;
        }
    }
    
    if (targetRange) {
        const position = targetRange.end.translate(-1, 0);
        editor.edit(editBuilder => {
            editBuilder.insert(position, insertText);
        });
    }
};

// Вставка текста с использованием снипетов (сниппетов)
export const insertSnippet = (snippetText: string, position?: vscode.Position) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}
    
    const snippet = new vscode.SnippetString(snippetText);
    
    if (position) {
        editor.insertSnippet(snippet, position);
    } else {
        editor.insertSnippet(snippet);
    }
};

// Вставка текста в несколько файлов одновременно
export const insertInMultipleFiles = async (files: string[], searchText: string, insertText: string) => {
    const workspaceEdit = new vscode.WorkspaceEdit();
    
    for (const filePath of files) {
        const uri = vscode.Uri.file(filePath);
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const text = document.getText();
            const index = text.indexOf(searchText);
            
            if (index !== -1) {
                const position = document.positionAt(index + searchText.length);
                workspaceEdit.insert(uri, position, insertText);
            }
        } catch (error) {
            console.error(`Failed to process file ${filePath}`, error);
        }
    }
    
    return vscode.workspace.applyEdit(workspaceEdit);
};
