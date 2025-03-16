import { OpenDialogOptions, window, workspace } from "vscode";
import { createDirs } from "../dir_handle";


// Открываем файл в VS Code
export function openTextDocument(destinationPath: string) {
    workspace.openTextDocument(destinationPath).then((doc) => {
        window.showTextDocument(doc);
    });
}


export async function askPickOption(placeHolder: string, folderOptions: Record<string, string[]>): Promise<string | undefined> {
    const selectedOption = await window.showQuickPick(Object.keys(folderOptions), {
        placeHolder: placeHolder
    });
    return selectedOption || undefined;
}

//Добавляем выбранный набор папок в проект
export async function addPickedFoldersSet(folderOptions: Record<string, string[]>) {

    const selectedOption = await askPickOption("Выберите структуру папок", folderOptions);

    if (selectedOption) {
        const selectedFolders = folderOptions[selectedOption];
        await createDirs(selectedFolders);
    }

}
        
