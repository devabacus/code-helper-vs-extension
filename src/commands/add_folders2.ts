import { window } from "vscode";
import { createDirs } from "../utils/dir_handle";
import { pickPath } from "../utils/ui/ui_util";
import { getUserInputWrapper } from "../utils/ui/ui_ask_folder";



// Основная функция для организации процесса создания директорий
export async function processDirectoryCreation(folderPaths: string[], userInputNeed: boolean = false): Promise<string | undefined> {
    // Получаем пользовательский ввод (если нужно)
    const userInput = await getUserInputWrapper(userInputNeed);
    if (userInputNeed && !userInput) {
        return undefined;
    }

    // Выбор категории (основной папки)
    const targetDirectory = await pickPath();
    if (!targetDirectory) {
        window.showErrorMessage("Операция отменена.");
        return undefined;
    }

    // Создаем директории
    // await createDirs(folderPaths, targetDirectory, userInput);
    return targetDirectory;
}

