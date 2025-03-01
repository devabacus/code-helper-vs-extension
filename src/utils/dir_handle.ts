import { mkdirp } from "mkdirp";
import { window } from "vscode";

export const createDirectory = async (targetDirectory: string) => mkdirp(targetDirectory);


export const createDirs = async (paths: string[]): Promise<void> => {
    for (const dirPath of paths) {
        try {
            await createDirectory(dirPath);
        } catch (error) {
            window.showErrorMessage(`Ошибка при создании папки: ${error}`);
        }
    }
};