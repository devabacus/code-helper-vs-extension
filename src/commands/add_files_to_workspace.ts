import * as vscode from "vscode";
import { addFileFromSnippetFolder } from "./file_helper";


export function selectAndAddPowerShellScript() {
    const options = [
        { label: "🐦 Flutter Handle", fileName: "flutter_handle.ps1" },
        { label: "🐍 Python Handle", fileName: "python_handle.ps1" },
    ];

    vscode.window.showQuickPick(options.map(o => o.label), { placeHolder: "Выберите PowerShell скрипт" })
        .then(selected => {
            if (!selected) return; // Если выбор отменён — ничего не делаем

            const selectedFile = options.find(o => o.label === selected)?.fileName;
            if (selectedFile) { addFileFromSnippetFolder(selectedFile); }
        });
}
