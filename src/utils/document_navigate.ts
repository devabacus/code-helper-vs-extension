import { Range, TextEditor, Uri, window, workspace } from "vscode";


export function getFullRange(textEditor: TextEditor) {
    const fullRange = new Range(
        textEditor.document.positionAt(0),
        textEditor.document.positionAt(textEditor.document.getText().length),
    );
}