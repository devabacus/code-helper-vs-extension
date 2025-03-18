import * as vscode from 'vscode';

// Класс для управления вставками текста с возможностью отмены
export class InsertionManager {
    private lastEditInfo: { 
        uri: vscode.Uri, 
        position: vscode.Position, 
        text: string 
    } | null = null;
    
    // Вставка текста с сохранением информации для возможной отмены
    async insert(insertText: string): Promise<boolean> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {return false;}
        
        const document = editor.document;
        const position = editor.selection.active;
        
        const result = await editor.edit(editBuilder => {
            editBuilder.insert(position, insertText);
        });
        
        if (result) {
            this.lastEditInfo = {
                uri: document.uri,
                position: position,
                text: insertText
            };
        }
        
        return result;
    }
    
    // Отмена последней вставки текста
    async undo(): Promise<boolean> {
        if (!this.lastEditInfo) {return false;}
        
        const { uri, position, text } = this.lastEditInfo;
        const editor = vscode.window.activeTextEditor;
        
        if (!editor || editor.document.uri.toString() !== uri.toString()) {
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc);
        }
        
        const endPosition = new vscode.Position(
            position.line + text.split('\n').length - 1,
            position.character + text.split('\n').pop()!.length
        );
        
        const range = new vscode.Range(position, endPosition);
        
        const result = await vscode.window.activeTextEditor!.edit(editBuilder => {
            editBuilder.delete(range);
        });
        
        if (result) {
            this.lastEditInfo = null;
        }
        
        return result;
    }
}
