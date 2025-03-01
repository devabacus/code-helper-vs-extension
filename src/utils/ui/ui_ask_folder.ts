import { window } from "vscode";
import { getUserInput } from "./ui_util";



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
}

