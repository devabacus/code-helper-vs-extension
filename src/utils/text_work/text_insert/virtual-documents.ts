import * as vscode from 'vscode';

// Провайдер для создания виртуальных документов
export class CustomContentProvider implements vscode.TextDocumentContentProvider {
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;
    
    private content = '';
    
    provideTextDocumentContent(_uri: vscode.Uri): string {
        return this.content;
    }
    
    setContent(newContent: string): void {
        this.content = newContent;
    }
    
    update(uri: vscode.Uri): void {
        this.onDidChangeEmitter.fire(uri);
    }
}

// Создание и отображение виртуального документа с указанным содержимым
export const showVirtualDocument = async (content: string, provider: CustomContentProvider) => {
    const uri = vscode.Uri.parse('untitled:generated.ts');
    provider.setContent(content);
    provider.update(uri);
    
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
};

// Регистрация провайдера виртуальных документов
export const registerContentProvider = () => {
    const provider = new CustomContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider('untitled', provider);
    return { provider, registration };
};
