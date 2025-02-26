import { mkdirp } from "mkdirp";
import { Uri, window, workspace, commands, ExtensionContext, OpenDialogOptions } from "vscode";

export async function newFeature() {
    // Запрос текста у пользователя
    const userInput = await window.showInputBox({ prompt: "Введите название папки" });
    if (!userInput || userInput.trim() === "") {
        window.showErrorMessage("Название папки не может быть пустым.");
        return;
    }

    // Запрос выбора директории
    const targetDirectory = await promptForTargetDirectory();
    if (!targetDirectory) {
        window.showErrorMessage("Выбор директории отменён.");
        return;
    }

    // Полный путь для новой папки
    
    let folderPaths = [
        'data/datasources',
        'data/repositories',
        'domain/entries',
        'domain/repositories',
        'domain/usecases',
        'presentadion/bloc',
        'presentadion/pages',
        'presentadion/widgets',
    ];
    
    
    for (var dirPath in folderPaths) {
        const newFolderPath = `${targetDirectory}/${userInput}/${folderPaths[dirPath]}`;
        try {
            await createDirectory(newFolderPath);
            window.showInformationMessage(`Папка '${newFolderPath}' успешно создана.`);
        } catch (error) {
            window.showErrorMessage(`Ошибка при создании папки: ${error}`);
        }
    }

}


// Функция создания папки
export async function createDirectory(targetDirectory: string) {
    try {
        await mkdirp(targetDirectory);
    } catch (error) {
        throw error;
    }
}

// Функция для выбора папки через диалоговое окно
async function promptForTargetDirectory(): Promise<string | undefined> {

    const defaultPath = workspace.workspaceFolders?.[0].uri.fsPath;
    const options: OpenDialogOptions = {

        canSelectMany: false,
        openLabel: "Выберите папку для создания",
        canSelectFolders: true,
        // defaultUri: defaultPath ? Uri.file(defaultPath) : undefined

    };

    const uri = await window.showOpenDialog(options);
    if (!uri || uri.length === 0) {
        return undefined;
    }
    return uri[0].fsPath;
}
