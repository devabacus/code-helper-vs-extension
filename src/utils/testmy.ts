import * as vscode from 'vscode';




export function testmy() {
    insertTextAfter("MaterialApp", ".router(\n  routerConfig: _router,");

}



const insertTextAfter = (searchText:string, insertText:string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const document = editor?.document;
    const text = document.getText();
    const index = text.indexOf(searchText);
    if (index === -1) return;

    const position = document.positionAt(index + searchText.length);
    editor.edit(editBuilder => {
        editBuilder.insert(position, '\n' + insertText);
    });
};
