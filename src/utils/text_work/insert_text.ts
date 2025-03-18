import * as fs from 'fs';
import { Range, window } from "vscode";


export function insertTextInDocument(text: string) {
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


export function insertTextToFile(newText: string, filePath: string) {
    fs.writeFileSync(filePath, newText, { encoding: "utf-8" });
}

const insertTextAfter = (searchText: string, insertText: string) => {
    const editor = window.activeTextEditor;
    if (!editor) {return;}
    const document = editor?.document;
    const text = document.getText();
    const index = text.indexOf(searchText);
    if (index === -1) {return;}

    const position = document.positionAt(index + searchText.length);
    editor.edit(editBuilder => {
        editBuilder.insert(position, '\n' + insertText);
    });
};
