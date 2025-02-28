import { Range, Uri, window, workspace } from "vscode";


export function insertText(text: string) {
    const editor = window.activeTextEditor;


    if (!editor) {
        return;
    }

    const document = editor.document;

    const fullRange = new Range(
        document.positionAt(0),
        document.positionAt(document.getText().length),
    );

    editor.edit(editBuilder => {
        editBuilder.replace(fullRange, text);
    });


}