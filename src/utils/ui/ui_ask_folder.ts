import { OpenDialogOptions, window, workspace } from "vscode";


// Получение пользовательского ввода
export const getUserInputWrapper = async (userInputNeed: boolean): Promise<string | undefined> => {
    if (!userInputNeed) {
        return undefined;
    }

    const userInput = await getUserInput("Введите название папки (или оставьте пустым)");
    if (!userInput) {
        window.showErrorMessage("Название папки не может быть пустым.");
        return undefined;
    }

    return userInput;
};


// Функция для получения ввода от пользователя
export const getUserInput = async (prompt: string, placeHolder = "", validateInput?: (text: string) => string | null): Promise<string | undefined> => {
    const userInput = await window.showInputBox({ prompt: prompt, placeHolder: placeHolder, validateInput });
    return userInput?.trim() || undefined;
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

// Функция для выбора папки через диалоговое окно
export const pickPath = async (): Promise<string | undefined> => {
    const path = await promptForTargetDirectory();
    if (!path) {
        window.showErrorMessage("Выбор директории отменён.");
    }
    return path;
};