import * as vscode from 'vscode';

// Вставка текста по конкретной позиции (строка и символ)
export const insertAtPosition = (line: number, character: number, insertText: string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}
    
    const position = new vscode.Position(line, character);
    editor.edit(editBuilder => {
        editBuilder.insert(position, insertText);
    });
};

// Вставка текста с заменой выделенного текста
export const replaceSelection = (insertText: string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}
    
    editor.edit(editBuilder => {
        editor.selections.forEach(selection => {
            editBuilder.replace(selection, insertText);
        });
    });
};

// Вставка текста в указанном диапазоне
export const insertInRange = (startLine: number, startChar: number, endLine: number, endChar: number, insertText: string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}
    
    const range = new vscode.Range(
        new vscode.Position(startLine, startChar),
        new vscode.Position(endLine, endChar)
    );
    
    editor.edit(editBuilder => {
        editBuilder.replace(range, insertText);
    });
};

// Вставка текста в определенную строку
export const insertAtLine = (lineNumber: number, insertText: string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}
    
    if (lineNumber < 0 || lineNumber >= editor.document.lineCount) {
        return;
    }
    
    const line = editor.document.lineAt(lineNumber);
    const position = new vscode.Position(lineNumber, line.text.length);
    
    editor.edit(editBuilder => {
        editBuilder.insert(position, insertText);
    });
};
