import { mkdirp } from "mkdirp";
import { Uri, window, workspace, OpenDialogOptions } from "vscode";

export const createDirectory = async (targetDirectory: string) => mkdirp(targetDirectory);

// Функция для выбора папки через диалоговое окно
export const pickPath = async (): Promise<string | undefined> => {
    const path = await promptForTargetDirectory();
    if (!path) {
        window.showErrorMessage("Выбор директории отменён.");
    }
    return path;
};


// Вспомогательная функция для выбора папки
export async function promptForTargetDirectory(): Promise<string | undefined> {
    const options: OpenDialogOptions = {
        canSelectMany: false,
        openLabel: "Выберите папку для создания",
        canSelectFolders: true,
        defaultUri: workspace.workspaceFolders?.[0]?.uri
    };

    return (await window.showOpenDialog(options))?.[0]?.fsPath;
}


// Функция для получения ввода от пользователя
export const getUserInput = async (prompt: string): Promise<string | undefined> => {
    const userInput = await window.showInputBox({ prompt: prompt });
    return userInput?.trim() || undefined;
};

// Основная функция для создания директорий
export async function createDirs(folderPaths: string[], userInputNeed: boolean = false):Promise<string|undefined> {
    let userInput: string | undefined;
    let newFolderPath;
    if (userInputNeed) {
        userInput = await getUserInput("Введите название папки (или оставьте пустым)");
        if (!userInput) {
            window.showErrorMessage("Название папки не может быть пустым.");
            return;
        }
    }

    // Выбор категории (основной папки)
    const targetDirectory = await pickPath();
    if (!targetDirectory) {
        window.showErrorMessage("Операция отменена.");
        return;
    }

    for (const dirPath of folderPaths) {
        // Формируем путь: если `userInput` указан, создаём папки внутри него
        newFolderPath = userInput 
            ? `${targetDirectory}/${userInput}/${dirPath}` 
            : `${targetDirectory}/${dirPath}`;

        try {
            await createDirectory(newFolderPath);
            // window.showInformationMessage(`Папка '${newFolderPath}' успешно создана.`);
        } catch (error) {
            window.showErrorMessage(`Ошибка при создании папки: ${error}`);
        }
    }
    return targetDirectory;

}


