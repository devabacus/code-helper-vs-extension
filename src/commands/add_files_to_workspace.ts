import * as vscode from "vscode";
import { copyFromSnippets, copyPowerShellFile } from "./file_helper";



// export function startFlutter() {
//     // copyPowerShellFile("flutter_handle.ps1");
//     copyFromSnippets("flutter_handle.ps1");
// }



/**
 * Отображает меню выбора и копирует `.ps1` файл в проект.
 */
export function selectAndAddPowerShellScript() {
    const options = [
        { label: "🐦 Flutter Handle", fileName: "flutter_handle.ps1" },
        { label: "🐍 Python Handle", fileName: "python_handle.ps1" },
    ];

    vscode.window.showQuickPick(options.map(o => o.label), { placeHolder: "Выберите PowerShell скрипт" })
        .then(selected => {
            if (!selected) return; // Если выбор отменён — ничего не делаем
            const selectedFile = options.find(o => o.label === selected)?.fileName;
            if (selectedFile) {copyFromSnippets(selectedFile);}
        });
}
