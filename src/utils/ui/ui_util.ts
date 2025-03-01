import { OpenDialogOptions, window, workspace } from "vscode";
import { createDirs } from "../dir_handle";



// Функция для получения ввода от пользователя
export const getUserInput = async (prompt: string, placeHolder = "", validateInput?: (text: string) => string | null): Promise<string | undefined> => {
    const userInput = await window.showInputBox({ prompt: prompt, placeHolder: placeHolder, validateInput });
    return userInput?.trim() || undefined;
};


// Функция для выбора папки через диалоговое окно
export const pickPath = async (): Promise<string | undefined> => {
    const path = await promptForTargetDirectory();
    if (!path) {
        window.showErrorMessage("Выбор директории отменён.");
    }
    return path;
};


// Вспомогательная функция для выбора папки
async function promptForTargetDirectory(): Promise<string | undefined> {
    const options: OpenDialogOptions = {
        canSelectMany: false,
        openLabel: "Выберите папку для создания",
        canSelectFolders: true,
        defaultUri: workspace.workspaceFolders?.[0]?.uri
    };

    return (await window.showOpenDialog(options))?.[0]?.fsPath;
}


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

