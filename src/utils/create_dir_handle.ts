import { mkdirp } from "mkdirp";
import { Uri, window, workspace, commands, ExtensionContext, OpenDialogOptions } from "vscode";


export const createDirectory = async (targetDirectory: string) => mkdirp(targetDirectory);

// Функция для выбора папки через диалоговое окно
export const pickPath = async():Promise<string|undefined> => {
    const path = await promptForTargetDirectory();
    if (!path) {
        window.showErrorMessage("Выбор директории отменён.");
        return;
    }

    return path;
};


export const  getUserInput = async(): Promise<string | undefined> => {
    const userInput = await window.showInputBox({ prompt: "Введите название папки" });
    if (!userInput || userInput.trim() === "") {
        window.showErrorMessage("Название папки не может быть пустым.");
        return;
    }   
    return userInput;
}


export async function createDirs(folderPaths: string[]) {
    const userInput = await getUserInput();
    const targetDirectory = await pickPath();
    for (var dirPath in folderPaths) {
        const newFolderPath = `${targetDirectory}/${userInput}/${folderPaths[dirPath]}`;
        try {
            await createDirectory(newFolderPath);
            // window.showInformationMessage(`Папка '${newFolderPath}' успешно создана.`);
        } catch (error) {
            window.showErrorMessage(`Ошибка при создании папки: ${error}`);
        }
    }
}

async function promptForTargetDirectory(): Promise<string | undefined> {

    const options: OpenDialogOptions = {
        canSelectMany: false,
        openLabel: "Выберите папку для создания",
        canSelectFolders: true,
        defaultUri: workspace.workspaceFolders?.[0]?.uri

    };

    return (await window.showOpenDialog(options))?.[0]?.fsPath;
}